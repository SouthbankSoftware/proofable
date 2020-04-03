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
 * @Date:   2020-03-11T14:01:54+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-04-03T15:57:55+11:00
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
