/*
 * @Author: guiguan
 * @Date:   2020-03-05T22:05:31+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-03-16T11:02:18+11:00
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
