/*
 * provenx-cli
 * Copyright (C) 2020  Southbank Software Ltd.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * @Author: guiguan
 * @Date:   2020-03-10T16:15:43+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-03-31T16:38:30+11:00
 */

package auth

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
	"time"
	"unsafe"

	"github.com/SouthbankSoftware/provenx/pkg/config"
	"github.com/dgrijalva/jwt-go"
	"golang.org/x/net/context/ctxhttp"
)

// Auth represents an authentication info
type Auth struct {
	Endpoint     string `json:"endpoint"`
	AuthToken    string `json:"authToken"`
	RefreshToken string `json:"refreshToken"`
}

// NewAuth creates a new Auth
func NewAuth(endpoint string) *Auth {
	return &Auth{Endpoint: endpoint}
}

// DeleteAuth deletes the Auth config from the user's config location
func DeleteAuth() error {
	ajPath, err := getAuthJSONPath()
	if err != nil {
		return err
	}

	return os.RemoveAll(ajPath)
}

// VerifyAuth verifies the Auth config from the user's config location and returns it. When the
// specified endpoint is empty, the endpoint itself will not be checked. When ErrTokenExpired is
// returned, the Auth is returned and non-nil
func VerifyAuth(endpoint string) (au *Auth, er error) {
	aut := new(Auth)

	err := aut.Load()
	if err != nil {
		if os.IsNotExist(err) {
			er = ErrAuthNotFound
			return
		}
	}

	if aut.Endpoint == "" || aut.AuthToken == "" || aut.RefreshToken == "" {
		er = ErrAuthNotFound
		return
	}

	if endpoint != "" && endpoint != aut.Endpoint {
		er = ErrAuthEndpointChanged
		return
	}

	claims := new(jwt.StandardClaims)

	_, _, err = new(jwt.Parser).ParseUnverified(aut.AuthToken, claims)
	if err != nil {
		er = err
		return
	}

	if claims.ExpiresAt-time.Now().Unix() < int64(tokenExpirationThreshold.Seconds()) {
		au = aut
		er = ErrTokenExpired
		return
	}

	au = aut
	return
}

func getAuthJSONPath() (pt string, er error) {
	return config.FilePath(fileNameAuthConfig)
}

// Load loads the Auth config from the user's config location
func (a *Auth) Load() error {
	ajPath, err := getAuthJSONPath()
	if err != nil {
		return err
	}

	data, err := ioutil.ReadFile(ajPath)
	if err != nil {
		return err
	}

	return json.Unmarshal(data, a)
}

// Save saves the Auth config to the user's config location
func (a *Auth) Save() error {
	ajPath, err := getAuthJSONPath()
	if err != nil {
		return err
	}

	// make sure dir exists
	err = os.MkdirAll(filepath.Dir(ajPath), config.FilePerm)
	if err != nil {
		return err
	}

	data, err := json.Marshal(a)
	if err != nil {
		return err
	}

	return ioutil.WriteFile(ajPath, data, config.FilePerm)
}

// RenewAuthToken renews the `authToken` with the `refreshToken`
func (a *Auth) RenewAuthToken(ctx context.Context) error {
	if a.AuthToken == "" {
		return errors.New("`authToken` must be provided")
	}

	if a.RefreshToken == "" {
		return errors.New("`refreshToken` must be provided")
	}

	if a.Endpoint == "" {
		return errors.New("`endpoint` must be provided")
	}

	type token struct {
		AuthToken    string `json:"auth_token"`
		RefreshToken string `json:"refresh_token"`
	}

	// `tk` is a view of `a` in `token` struct pointer
	tk := (*token)(unsafe.Pointer(&a.AuthToken))

	reqData, err := json.Marshal(tk)
	if err != nil {
		return err
	}

	res, err := ctxhttp.Post(ctx, &http.Client{},
		a.Endpoint+"/auth/verifytoken", "application/json", bytes.NewBuffer(reqData))
	if err != nil {
		return err
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return err
	}

	if res.StatusCode != http.StatusOK {
		// handle error
		return errors.New(string(body))
	}

	return json.Unmarshal(body, tk)
}
