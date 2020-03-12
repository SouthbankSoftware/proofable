/*
 * @Author: guiguan
 * @Date:   2020-03-11T11:29:59+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-03-12T14:01:47+11:00
 */

package auth

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"sync"
	"time"

	"github.com/phayes/freeport"
	"github.com/skratchdot/open-golang/open"
	"golang.org/x/sync/errgroup"
)

// SignInWithOauth signs in ProvenDB with OAuth
func (a *Auth) SignInWithOauth(ctx context.Context, provider string) error {
	port, err := freeport.GetFreePort()
	if err != nil {
		return err
	}

	eg, ctx := errgroup.WithContext(ctx)

	srv := http.Server{Addr: "localhost:" + strconv.Itoa(port)}

	errChan := make(chan error, 1)
	errChanOnce := new(sync.Once)
	closeSRVWithErr := func(err error) {
		errChanOnce.Do(func() {
			if err != nil {
				errChan <- err
			}

			close(errChan)

			// grace time for allowing the result template to be presented to user
			time.Sleep(2 * time.Second)
			srv.Close()
		})
	}

	eg.Go(func() error {
		// start callback http server
		sm := http.NewServeMux()

		sm.HandleFunc("/loginSucceeded", func(w http.ResponseWriter, r *http.Request) {
			var er error

			defer func() {
				if er != nil {
					renderTemplate(templateLoginFailed, w)
				}

				closeSRVWithErr(er)
			}()

			queries := r.URL.Query()

			if t := queries.Get("authToken"); t != "" {
				a.AuthToken = t
			} else {
				er = errors.New("`authToken` is missing from OAuth callback")
				return
			}

			if t := queries.Get("refreshToken"); t != "" {
				a.RefreshToken = t
			} else {
				er = errors.New("`refreshToken` is missing from OAuth callback")
				return
			}

			er = renderTemplate(templateLoginSucceeded, w)
		})

		sm.HandleFunc("/loginFailed", func(w http.ResponseWriter, r *http.Request) {
			var er error

			defer func() {
				closeSRVWithErr(er)
			}()

			renderTemplate(templateLoginFailed, w)

			er = errors.New("login failed")
		})

		srv.Handler = sm

		err := srv.ListenAndServe()
		if err != nil && !errors.Is(err, http.ErrServerClosed) {
			return err
		}

		return nil
	})

	eg.Go(func() error {
		// oversee the callback process
		defer closeSRVWithErr(nil)

		select {
		case <-ctx.Done():
			return ctx.Err()
		case err := <-errChan:
			return err
		}
	})

	eg.Go(func() error {
		// visit oauth uri
		uri := fmt.Sprintf(
			"%v/auth/login?redirectURL=http://localhost:%v/login&app=provendb-cli&provider=%v",
			a.Endpoint, port, provider)

		return open.Run(uri)
	})

	return eg.Wait()
}
