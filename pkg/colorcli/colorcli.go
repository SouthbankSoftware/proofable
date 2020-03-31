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
 * @Date:   2020-03-11T16:47:17+11:00
 * @Last modified by:   guiguan
 * @Last modified time: 2020-03-31T17:03:53+11:00
 */

package colorcli

import (
	"fmt"

	"github.com/fatih/color"
)

var (
	// HeaderWhite is function to generate a white header string
	HeaderWhite = color.New(color.BgHiWhite, color.FgHiBlack, color.Bold).SprintFunc()
	// HeaderGreen is function to generate a green header string
	HeaderGreen = color.New(color.BgHiGreen, color.FgHiWhite, color.Bold).SprintFunc()
	// HeaderYellow is function to generate a yellow header string
	HeaderYellow = color.New(color.BgHiYellow, color.FgHiWhite, color.Bold).SprintFunc()
	// HeaderRed is function to generate a red header string
	HeaderRed = color.New(color.BgHiRed, color.FgHiWhite, color.Bold).SprintFunc()

	// Green is function to generate a green string
	Green = color.New(color.FgHiGreen).SprintFunc()
	// Yellow is function to generate a yellow string
	Yellow = color.New(color.FgHiYellow).SprintFunc()
	// Red is function to generate a red string
	Red = color.New(color.FgHiRed).SprintFunc()
)

// Printf formats according to the format specifier and writes to the stdout that is all platform
// compatible
func Printf(format string, a ...interface{}) {
	// use color.Output so it is Windows compatible
	fmt.Fprintf(color.Output, format, a...)
}

// Errorf formats according to the format specifier and writes to the stderr that is all
// platform compatible
func Errorf(format string, a ...interface{}) {
	// use color.Error so it is Windows compatible
	fmt.Fprintf(color.Error, format, a...)
}

// Oklnf writes to stdout a formated ok message with a newline
func Oklnf(format string, a ...interface{}) {
	Printf("%s ", HeaderGreen(" OK "))
	Printf(format, a...)
	Printf("\n")
}

// Passlnf writes to stdout a formated pass message with a newline
func Passlnf(format string, a ...interface{}) {
	Printf("%s ", HeaderGreen(" PASS "))
	Printf(format, a...)
	Printf("\n")
}

// Infolnf writes to stdout a formated info message with a newline
func Infolnf(format string, a ...interface{}) {
	Printf("%s ", HeaderWhite(" INFO "))
	Printf(format, a...)
	Printf("\n")
}

// Warnlnf writes to stdout a formated warning message with a newline
func Warnlnf(format string, a ...interface{}) {
	Printf("%s ", HeaderYellow(" WARN "))
	Printf(format, a...)
	Printf("\n")
}

// Faillnf writes to stderr a formated fail message with a newline
func Faillnf(format string, a ...interface{}) {
	Errorf("%s ", HeaderRed(" FAIL "))
	Errorf(format, a...)
	Errorf("\n")
}
