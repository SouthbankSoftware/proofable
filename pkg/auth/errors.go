/*
 * @Author: guiguan
 * @Date:   2020-03-11T14:01:54+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-03-11T14:54:24+11:00
 */

package auth

import (
	"errors"
)

var (
	// ErrAuthNotFound is the error returned when Auth is not found in the user's config location
	ErrAuthNotFound = errors.New("auth not found")
	// ErrAuthEndpointChanged is the error returned when an Auth's endpoint has changed
	ErrAuthEndpointChanged = errors.New("auth endpoint changed")
	// ErrTokenExpired is the error returned when a token has expired
	ErrTokenExpired = errors.New("token expired")
)
