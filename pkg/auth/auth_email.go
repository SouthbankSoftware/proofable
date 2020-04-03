/*
 * proofable
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
 * @Date:   2020-03-11T11:29:36+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-04-03T15:57:55+11:00
 */

package auth

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"
	"unsafe"

	"golang.org/x/net/context/ctxhttp"
)

// SignInWithEmail signs in ProvenDB with email
func (a *Auth) SignInWithEmail(ctx context.Context, email, pwd string) error {
	type request struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	req := &request{
		Email:    email,
		Password: pwd,
	}

	reqData, err := json.Marshal(req)
	if err != nil {
		return err
	}

	res, err := ctxhttp.Post(ctx, &http.Client{},
		a.Endpoint+"/auth/emaillogin", "application/json", bytes.NewBuffer(reqData))
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

	type token struct {
		AuthToken    string `json:"auth_token"`
		RefreshToken string `json:"refresh_token"`
	}

	// `tk` is a view of `a` in `token` struct pointer
	tk := (*token)(unsafe.Pointer(&a.AuthToken))

	return json.Unmarshal(body, tk)
}
