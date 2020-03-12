/*
 * @Author: guiguan
 * @Date:   2020-03-11T12:19:34+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-03-12T14:21:20+11:00
 */

package authcli

import (
	"context"
	"errors"
	"regexp"
	"strings"

	"github.com/SouthbankSoftware/provenx-cli/pkg/auth"
	"github.com/manifoldco/promptui"
)

func newAuth(
	ctx context.Context,
	endpoint string,
) (au *auth.Auth, er error) {
	aut := &auth.Auth{
		Endpoint: endpoint,
	}

	type oauthProvider struct {
		Name string
	}

	providers := []oauthProvider{
		{Name: "Google"},
		{Name: "Github"},
		{Name: "Facebook"},
		{Name: "Email"},
	}

	prompt := promptui.Select{
		Label: "Sign in to ProvenDB with",
		Items: providers,
		Templates: &promptui.SelectTemplates{
			Label:    "{{ . }}:",
			Active:   "\U00002713 {{ .Name | green }}",
			Inactive: "  {{ .Name | cyan }} ",
			Selected: "\U00002713 {{ .Name | green | cyan }}",
		},
		Size: 4,
	}

	choice, _, err := prompt.Run()
	if err != nil {
		er = err
		return
	}

	switch {
	case choice < 3:
		err := aut.SignInWithOauth(ctx, strings.ToLower(providers[choice].Name))
		if err != nil {
			er = err
			return
		}
	default:
		prompt := promptui.Prompt{
			Label: "Email",
			Validate: func(input string) error {
				var rxEmail = regexp.MustCompile("^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")

				if len(input) > 254 || !rxEmail.MatchString(input) {
					return errors.New("invalid email")
				}
				return nil
			},
		}

		email, err := prompt.Run()
		if err != nil {
			er = err
			return
		}

		prompt = promptui.Prompt{
			Label: "Password",
			Validate: func(input string) error {
				if len(input) < 3 {
					return errors.New("password length must >= 3")
				}
				return nil
			},
			Mask: '*',
		}

		pwd, err := prompt.Run()
		if err != nil {
			er = err
			return
		}

		err = aut.SignInWithEmail(ctx, email, pwd)
		if err != nil {
			er = err
			return
		}
	}

	err = aut.Save()
	if err != nil {
		er = err
		return
	}

	au = aut
	return
}

// Authenticate authenticates with ProvenDB via the CLI
func Authenticate(
	ctx context.Context,
	endpoint string,
) (au *auth.Auth, er error) {
	aut, err := auth.VerifyAuth(endpoint)
	if err != nil {
		switch {
		case errors.Is(err, auth.ErrTokenExpired):
			// try renew before creating a new one
			err := aut.RenewAuthToken(ctx)
			if err != nil {
				return newAuth(ctx, endpoint)
			}

			err = aut.Save()
			if err != nil {
				er = err
				return
			}
		default:
			return newAuth(ctx, endpoint)
		}
	}

	au = aut
	return
}
