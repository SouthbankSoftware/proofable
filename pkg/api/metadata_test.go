/*
 * provenx
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
 * @Date:   2020-03-05T22:05:31+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-03-31T17:03:53+11:00
 */

package api

import (
	"reflect"
	"testing"
)

func TestNormalizeKey(t *testing.T) {
	type args struct {
		key []byte
	}
	tests := []struct {
		name string
		args args
		want []byte
	}{
		{
			name: "no need to normalize",
			args: args{
				key: []byte("Flutter in Action.pdf\x00@META/size"),
			},
			want: []byte("Flutter in Action.pdf\x00@META/size"),
		},
		{
			name: "need to normalize in the middle",
			args: args{
				key: []byte("Flutter in Action.pdf@META/size"),
			},
			want: []byte("Flutter in Action.pdf\x00@META/size"),
		},
		{
			name: "need to normalize up front",
			args: args{
				key: []byte("@META/size"),
			},
			want: []byte("\x00@META/size"),
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := NormalizeKey(tt.args.key); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("NormalizeKey() = %v, want %v", got, tt.want)
			}
		})
	}
}
