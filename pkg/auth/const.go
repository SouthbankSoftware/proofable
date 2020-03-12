/*
 * @Author: Wahaj Shamim <wahaj>
 * @Date:   2019-12-17T08:55:50+11:00
 * @Email:  wahaj@southbanksoftware.com
 * @Last modified by:   guiguan
 * @Last modified time: 2020-03-12T11:34:37+11:00
 */

package auth

import "time"

const (
	fileNameAuthConfig = "auth.json"

	// tokenExpirationThreshold is the lifespan duration that a token must have for it to be valid
	tokenExpirationThreshold = time.Minute
)
