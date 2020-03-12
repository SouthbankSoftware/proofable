/*
 * @Author: guiguan
 * @Date:   2020-03-11T11:29:36+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-03-11T19:40:50+11:00
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
