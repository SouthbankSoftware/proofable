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
 * HTML templates for auth success and failure pages.
 *
 * @Author: Michael Harrison (Mike@Southbanksoftware.com)
 * @Date:   2020-02-21T11:28:11+11:00
 * @Last modified by:   Michael Harrison
 * @Last modified time: 2020-10-13T13:07:25+11:00
 */

package auth

import (
	"html/template"
	"io"
)

func renderTemplate(tpl string, w io.Writer, key string) error {
	tp, err := template.New("loginSucceeded").Parse(tpl)
	if err != nil {
		return err
	}
	return tp.Execute(w, struct {
		Title string
		Key   string
	}{
		Title: "ProvenDB",
		Key:   key,
	})
}

var (
	templateLoginSucceeded = `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <title>{{.Title}}</title>
      <link href="https://fonts.googleapis.com/css?family=Poppins&display=swap" rel="stylesheet">
      <style>
      html {
        height: calc(100% - 36px);
        background-color: white;
      }
      body {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-content: center;
        background-color: white;
				padding: 36px;
				padding-bottom: 0px;
				height: 100%;
      }
      h1 {
        width: 435px;
        height: 132px;
        font-family: Poppins;
        font-size: 45px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.51;
        letter-spacing: normal;
        text-align: left;
        color: #4d4f5c;
      }
      p {
        width: 391px;
        height: 95px;
        font-family: Roboto;
        font-size: 15px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.67;
        letter-spacing: normal;
        text-align: left;
        color: #808495;
      }
      .middle {
        display:flex;
        flex-direction:row;
        justify-content: center;
				align-items: center;
				height: 100%;
				
			}
			.left {
				margin-right: 30px;
			}
      .buttons {
        display: flex;
        flex-direction:row;
        justify-content: space-between;

      }
      button {
        width: 176px;
        height: 59px;
        border-radius: 30px;
        border: solid 1px #808495;
        font-family: Poppins;
        font-size: 15px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: 0.87;
        letter-spacing: normal;
        text-align: center;
        color: #808495;
			}
			
			a {
				width: 100%;
				display: flex;
				height: 100%;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				text-decoration: none;
				font-family: Poppins;
        font-size: 15px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: 0.87;
        letter-spacing: normal;
        text-align: center;
        color: #808495;
      }
      .keyArea {
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: end;
        height:auto;
      }
      .keyArea p {
        height: auto;
        width: auto;
        margin-right: 12px;
        margin-bottom: 4px;
      }
      .key {
        border: 1px solid rgba(128, 132, 149, 0.5);
        border-radius: 0.5em;
        resize: none;
        width: 450px;
        padding:4px;
        font-family: Roboto;
        font-size: 13px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        letter-spacing: normal;
        text-align: left;
        color: #808495;
      }
      .blue {
        border: none;
        background-image: linear-gradient(258deg, #42d9fc 127%, #35b3d4 22%);
			}
      .links {
        height: 55px;
      }
			.blue a {
				font-family: Poppins;
        font-size: 15px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: 0.87;
        letter-spacing: normal;
        text-align: center;
        color: #ffffff;
			}
      </style>
    </head>
    <body>
      <div class="header">
        <svg xmlns="http://www.w3.org/2000/svg" id="prefix__provendb-logo" width="124.537" height="29.075" viewBox="0 0 124.537 29.075">
          <defs>
              <style>
							#prefix__provendb-logo .prefix__cls-1{fill:#35b3d4 !important}
              #prefix__provendb-logo .prefix__cls-2{fill:#4d4f5c !important}
              </style>
          </defs>
          <path id="prefix__Path_12927" d="M152.4 18.3l-5.64 12.961-4.554-6.27-4.306 2.977 7.251 9.7h4.834l8.443-19.368z" class="prefix__cls-1" data-name="Path 12927" transform="translate(-90.714 -13.466)"/>
          <path id="prefix__Path_12928" d="M270.061 23.83a3.249 3.249 0 00-.175-.35c-.07-.105-.175-.315-.245-.455a3.03 3.03 0 00-.245-.35v-.035a13.179 13.179 0 00-.876-1.086l-.315-.35c-.21-.21-.455-.42-.7-.631a9.635 9.635 0 00-1.156-.806 6.427 6.427 0 00-.841-.455 6.52 6.52 0 00-.876-.35 2.267 2.267 0 00-.455-.14c-.315-.105-.631-.175-.911-.245l-.455-.07h-.035a10.39 10.39 0 00-1.476-.107h-.63a9.727 9.727 0 00-2.207.385l-.315.105a9.126 9.126 0 00-.876.35l-.28.14c-.105.035-.175.105-.28.14s-.175.105-.28.14a9.688 9.688 0 00-4.834 8.267v9.844h4.834V27.508c0-.105.035-.245.035-.35a.211.211 0 01.035-.14 5.056 5.056 0 01.876-1.927 3.063 3.063 0 01.28-.35 4.776 4.776 0 013.573-1.576h.525a.263.263 0 01.175.035h.14l.14.035c.14.035.245.07.385.105l.175.07c.07.035.14.035.175.07l.175.07a6.173 6.173 0 011.3.806l.14.14.28.28a1.925 1.925 0 01.245.315.654.654 0 00.105.14.765.765 0 01.105.175c.035.07.07.105.105.175a3.982 3.982 0 01.455 1.051 4.913 4.913 0 01.21 1.436v9.668h4.834v-9.7a8.036 8.036 0 00-.839-4.206z" class="prefix__cls-2" data-name="Path 12928" transform="translate(-164.584 -13.531)"/>
          <path id="prefix__Path_12929" d="M61.9 27.968v9.668h4.834v-9.668a4.821 4.821 0 014.834-4.834 4.7 4.7 0 011.226.14v-4.9c-.385-.035-.806-.07-1.226-.07a9.71 9.71 0 00-9.668 9.664z" class="prefix__cls-2" data-name="Path 12929" transform="translate(-41.337 -13.466)"/>
          <path id="prefix__Path_12930" d="M345.251 7.408a2.9 2.9 0 00-2.907-2.908H338v9.668h4.344a2.9 2.9 0 002.908-2.908 3 3 0 00-.736-1.927 2.666 2.666 0 00.735-1.925zm-5.29-.981h2.417a.979.979 0 01.981.981.958.958 0 01-.981.981h-2.417zm2.417 5.815h-2.417v-1.927h2.417a.984.984 0 01.911 1.051 1.007 1.007 0 01-.91.876z" class="prefix__cls-2" data-name="Path 12930" transform="translate(-220.717 -4.5)"/>
          <path id="prefix__Path_12931" d="M314.143 4.6H310.5v9.668h3.643a4.834 4.834 0 100-9.668zm0 7.707h-1.681V6.492h1.681a2.908 2.908 0 010 5.815z" class="prefix__cls-2" data-name="Path 12931" transform="translate(-202.851 -4.565)"/>
          <path id="prefix__Path_12932" d="M14.095 4.6H3.2v24.171h4.834v-7.287h6.06a8.484 8.484 0 008.477-8.477A8.38 8.38 0 0014.095 4.6zm0 12.086H8.069V9.434h6.06a3.626 3.626 0 11-.035 7.251z" class="prefix__cls-2" data-name="Path 12932" transform="translate(-3.2 -4.565)"/>
          <path id="prefix__Path_12933" d="M202.868 18.4a9.668 9.668 0 108.968 13.312h-5.745a4.863 4.863 0 01-6.831-.42 5.247 5.247 0 01-.876-1.4h13.977a10.359 10.359 0 00.175-1.822 9.688 9.688 0 00-9.668-9.67zm-4.484 7.847a4.784 4.784 0 016.27-2.662 4.843 4.843 0 012.662 2.662z" class="prefix__cls-2" data-name="Path 12933" transform="translate(-126.642 -13.531)"/>
          <path id="prefix__Path_12934" d="M106.2 23.27a4.8 4.8 0 014.624 3.468l4.1-2.837a9.667 9.667 0 10-4.484 12.891 9.549 9.549 0 003.433-2.8l-3.153-4.239a4.832 4.832 0 01-9.073-3.328 4.758 4.758 0 014.553-3.155z" class="prefix__cls-2" data-name="Path 12934" transform="translate(-63.852 -13.566)"/>
          <g id="prefix__Group_3497" data-name="Group 3497" transform="translate(42.632 .035)">
              <path id="prefix__Path_12935" d="M129.384 7.017H148.9a2.2 2.2 0 012.2 2.207v1.226a10.814 10.814 0 012.382-1.576V8.7a4.1 4.1 0 00-4.1-4.1h-20.489a4.1 4.1 0 00-3.993 3.153 10 10 0 012.522.42 2.226 2.226 0 011.962-1.156z" class="prefix__cls-1" data-name="Path 12935" transform="translate(-124.9 -4.6)"/>
              <path id="prefix__Path_12936" d="M151.1 70.6v1.331a2.2 2.2 0 01-2.207 2.207h-19.509a2.146 2.146 0 01-1.962-1.226 11.844 11.844 0 01-2.522.385 4.1 4.1 0 004.029 3.223h20.493a4.1 4.1 0 004.1-4.1v-.28a12.326 12.326 0 01-2.422-1.54z" class="prefix__cls-1" data-name="Path 12936" transform="translate(-124.9 -47.48)"/>
          </g>
      </svg>
      
      </div>
      <div class="keyArea">
        <p>Your API key is:</p>
        <textarea rows="4" class="key">{{.Key}}</textarea>
      </div>
      <div class="middle">
        <div class="left">
          <svg xmlns="http://www.w3.org/2000/svg" id="prefix__authentication-pass-icon" width="530.9" height="346.987" viewBox="0 0 530.9 346.987">
            <defs>
                <style>
                    .prefix__cls-1{fill:#cbe6f8}.prefix__cls-2{fill:#32b2d3}.prefix__cls-4{fill:#4d4f5c;opacity:.03}
                </style>
            </defs>
            <g id="prefix__Group_3786" data-name="Group 3786" transform="translate(267.955 27.217)">
                <path id="prefix__Path_13464" d="M355.111 168v-56.37h-18.9a2.284 2.284 0 01-2.278-2.278V80.2l-46.352-23.461L238.5 31.8v217.28h94.177c.8-1.253 1.48-2.505 2.164-3.644H327.1v-6.719h11.388c.8-1.48 1.48-2.961 2.164-4.441h-13.21v-15.944a2.278 2.278 0 10-4.555 0v26.42h-63.2v-26.533a2.259 2.259 0 00-2.391-2.05 2.3 2.3 0 00-2.05 2.05v15.943H241.8v-2.05h11.274v-36.669a18.855 18.855 0 016.149-1.594l14.349-1.253a2.132 2.132 0 00.569 2.278 27.006 27.006 0 0017.423 7.516 27.471 27.471 0 0017.423-7.4 2.372 2.372 0 00.569-2.278l14.349 1.253a18.932 18.932 0 0117.2 16.74h.114v22.548a150.961 150.961 0 0014.007-62.861h.114v-.683l-.229-1.709zM254.9 238.717v6.036h-13.439v-6.036zm9.68-84.156a13.663 13.663 0 01-.569-4.1c0-3.644.8-4.327.8-4.327a3.23 3.23 0 011.48.456 78.6 78.6 0 00.909 11.61 6.609 6.609 0 01-2.622-3.639zm5.58-16.285h-5.011c-.114-.8-.342-1.594-.456-2.619V131.1a18.079 18.079 0 0118.22-17.993h33.936v22.206h-.114v.342h-7.744c-9.68-7.63-27.217-5.922-34.619-4.9a4.919 4.919 0 00-4.214 4.9v2.619zm1.025 11.957a9.2 9.2 0 01.114-1.708h12.754v4.441a2.339 2.339 0 01-2.164 2.278h-8.769a2.422 2.422 0 01-1.708-.8v-.114c-.001-.453-.112-2.047-.229-4.097zm19.929 47.6a21.751 21.751 0 01-12.982-5.125c.228-.683.569-1.139.8-1.936v-.114a41.713 41.713 0 002.278-9 19.648 19.648 0 0019.7 0 61.609 61.609 0 002.391 9 13.1 13.1 0 00.683 1.936 20.619 20.619 0 01-12.872 5.24zm18.334-36.669a32.8 32.8 0 01-2.278 6.377 42.346 42.346 0 01-2.17 3.874h.114c-3.416 5.238-7.858 8.085-13.1 8.427H291c-5.466 0-10.135-2.619-13.665-7.858a41.472 41.472 0 01-2.619-4.441c-.456-1.025-.911-2.05-1.253-3.075s-.683-2.164-1.025-3.3c-.114-.456-.228-.911-.342-1.48v-.114h9.566a6.684 6.684 0 006.6-6.6v-3.3a4.181 4.181 0 012.278-1.025 4.583 4.583 0 012.278 1.025v3.416a6.684 6.684 0 006.6 6.6h8.769a5.544 5.544 0 001.367-.114h.342zm.569-7.288a1.994 1.994 0 01-1.936 1.253h-8.769a2.362 2.362 0 01-2.278-2.278v-4.441h13.1a21.716 21.716 0 01-.119 5.467zm1.253-9.452c-.683-.228-1.025-.342-1.025-.114H294.87a2.248 2.248 0 00-1.594.683 6.038 6.038 0 00-5.58 0 2.248 2.248 0 00-1.594-.683h-15.26v-.8h1.367a2.721 2.721 0 001.594-.569 2.442 2.442 0 001.253-2.164v-5.352c0-.114 0-.114.114-.114a80.824 80.824 0 0115.715-.8c5.922.456 10.591 1.708 13.893 3.758h.114c.8.569 1.48 1.139 2.164 1.708.114.114.342.228.456.342a2.721 2.721 0 001.594.569h.683a1.234 1.234 0 011.253 0h.569zm6.719 5.922c0 4.441-1.48 6.833-3.189 7.971a92 92 0 00.911-9.794v-1.708a3.529 3.529 0 011.48-.683s.114 0 .114.228c.342.456.683 1.594.683 3.986z" class="prefix__cls-1" data-name="Path 13464" transform="translate(-238.5 -31.8)"/>
            </g>
            <path id="prefix__Path_13465" d="M251.313 268.1c0 .683-1.025 1.367-2.278 1.367H129.578c-1.253 0-2.278-.569-2.278-1.367v-15.833c0-.683 1.025-1.367 2.278-1.367h119.458c1.253 0 2.278.569 2.278 1.367V268.1z" class="prefix__cls-1" data-name="Path 13465" transform="translate(14.023 25.824)"/>
            <path id="prefix__Path_13466" d="M141.3 23.6c-30.405 0-55 26.761-55 59.672 0 33.025 24.6 59.672 55 59.672s55-26.761 55-59.672-24.591-59.672-55-59.672zm-19.929 91.786L95.182 89.194 106.8 77.578l14.576 14.576 40.768-40.768L173.758 63z" class="prefix__cls-1" data-name="Path 13466" transform="translate(8.333 -5.721)"/>
            <g id="prefix__Group_3557_2_" transform="translate(148.709 103.945)">
                <g id="prefix__Group_3525_2_">
                    <path id="prefix__Path_13130_2_" d="M58.3-32.3v71.515h41.224l3.076-24.483h14.007l3.075 24.484H174.8V-32.3z" class="prefix__cls-1" transform="translate(-44.293 82.301)"/>
                    <path id="prefix__Path_13131_2_" d="M115.661 5.5H95.049L88.9 51.279h32.8zM98.352 9.372h14.007l4.9 39.288h-23.8z" class="prefix__cls-2" transform="translate(-40.046 87.547)"/>
                    <path id="prefix__Path_13134_2_" d="M190.619-72.186a22.477 22.477 0 00-6.719 1.139v16.285c8.2-1.025 23.8-1.936 32.683 5.125h7.744V-72.3z" transform="translate(-26.862 76.75)" style="fill:#cbe5f7"/>
                    <path id="prefix__Path_13467" d="M97.549 32.913a5.5 5.5 0 01.8-4.213H55.3a6.736 6.736 0 01.569 4.213z" class="prefix__cls-2" data-name="Path 13467" transform="translate(-44.709 90.767)"/>
                    <path id="prefix__Path_13468" d="M271.707 25.267a23.287 23.287 0 00-21.182-20.385L233.9 3.288a44.17 44.17 0 01-2.05-9.338 32.031 32.031 0 006.377-9.11 48.862 48.862 0 002.164-5.694c3.075-.8 9.11-3.53 9.11-13.324a11.394 11.394 0 00-1.594-6.6c-.114-.228-.342-.456-.456-.683a24.276 24.276 0 00.911-6.947v-25.513a2.24 2.24 0 00-2.392-2.279l-40.655.228a23.017 23.017 0 00-18.676 22.32v5.238a6.493 6.493 0 00.114 1.48 16.99 16.99 0 00.228 2.391v.114c.114.569.228 1.253.342 1.822v.114c.114.569.342 1.139.456 1.822a11.109 11.109 0 00-1.48 6.6 19.945 19.945 0 00.569 4.9 11.313 11.313 0 008.427 8.541 27.476 27.476 0 00.911 2.847c.342 1.025.8 1.936 1.253 2.961a30.268 30.268 0 006.491 9.11 43.157 43.157 0 01-2.05 9.224L185.273 5a20.375 20.375 0 00-5.808 1.253V-29.4l-133.351-.337A6.276 6.276 0 0146-24.043a8.619 8.619 0 011.708.114V-25.3h127.2v68.673h-53.065a5.46 5.46 0 01.342 4.213h41.565v12.64H63.765a6.348 6.348 0 01.8 4.327H261.23a5.8 5.8 0 011.139-4.1h-8.541v-6.261h12.185a4.777 4.777 0 011.025-1.594 5.419 5.419 0 012.733-4.1 5.756 5.756 0 012.164-3.416c-.001-9.453-.228-19.815-.228-19.815zM218.753-5.025h-1.025c-5.466 0-10.135-2.619-13.665-7.858a41.469 41.469 0 01-2.619-4.441c-.456-1.025-.911-2.05-1.253-3.075s-.683-2.164-1.025-3.3c-.114-.456-.228-.911-.342-1.48v-.121h9.566a6.684 6.684 0 006.6-6.6v-3.3a4.182 4.182 0 012.278-1.025 4.583 4.583 0 012.282 1.025v3.416a6.684 6.684 0 006.6 6.6h8.769a5.544 5.544 0 001.367-.114h.342l-.456 1.708a32.8 32.8 0 01-2.272 6.38 42.345 42.345 0 01-2.164 3.872h.114c-3.303 5.238-7.745 7.971-13.097 8.313zm12.071 12.982a21.849 21.849 0 01-12.868 5.243 21.751 21.751 0 01-12.982-5.125c.228-.683.569-1.139.8-1.936v-.118a41.713 41.713 0 002.278-9 19.648 19.648 0 0019.7 0 61.61 61.61 0 002.391 9 5.606 5.606 0 00.683 1.936zm-36.782-34.391a7.535 7.535 0 01-2.733-3.758 13.663 13.663 0 01-.569-4.1c0-3.644.8-4.327.8-4.327a3.23 3.23 0 011.48.456 80.173 80.173 0 001.022 11.729zm49.878-12.071s.114 0 .114.228a8.4 8.4 0 01.683 3.986c0 4.441-1.48 6.833-3.189 7.971a92.016 92.016 0 00.911-9.794v-1.708a2.9 2.9 0 011.481-.683zm-46.007 3.985a9.2 9.2 0 01.114-1.708h12.754v4.441a2.339 2.339 0 01-2.164 2.278h-8.769a2.422 2.422 0 01-1.708-.8v-.114c.001-.339-.113-2.047-.227-4.097zm-.342-5.922v-.8h1.367a2.721 2.721 0 001.594-.569 2.442 2.442 0 001.253-2.164v-5.352c0-.114 0-.114.114-.114a80.824 80.824 0 0115.715-.8c5.922.456 10.591 1.708 13.893 3.758h.114c.8.569 1.48 1.139 2.164 1.708.114.114.342.228.456.342a2.721 2.721 0 001.594.569h.683a1.234 1.234 0 011.253 0h.569l-.228 3.416c-.683-.228-1.025-.342-1.025-.114h-15.373a2.248 2.248 0 00-1.594.683 6.038 6.038 0 00-5.58 0 2.248 2.248 0 00-1.594-.683h-15.374zm26.306 4.213h13.1a27.7 27.7 0 01-.228 5.352 1.994 1.994 0 01-1.936 1.253h-8.769a2.362 2.362 0 01-2.278-2.278v-4.327zm-32.455-17.422a18.079 18.079 0 0118.221-17.993h33.936v22.206h-.114v.342h-7.744c-9.68-7.63-27.217-5.922-34.619-4.9a4.919 4.919 0 00-4.213 4.9v2.619h-5.011c-.114-.8-.342-1.594-.456-2.619v-4.555zM181.743 60h-13.438v-6.036h13.438zm72.427-10.477V33.58a2.278 2.278 0 00-4.555 0V60h-63.2V33.466a2.259 2.259 0 00-2.391-2.05 2.3 2.3 0 00-2.05 2.05v15.943h-13.441v-2.05h11.274V10.8a18.855 18.855 0 016.149-1.594L200.3 7.957a2.132 2.132 0 00.569 2.278 27.006 27.006 0 0017.431 7.516 27.471 27.471 0 0017.423-7.4 2.372 2.372 0 00.569-2.278l14.349 1.253a18.932 18.932 0 0117.2 16.74h.114v23.457z" class="prefix__cls-2" data-name="Path 13468" transform="translate(-46 76.208)"/>
                </g>
            </g>
            <path id="prefix__Path_13469" d="M167.23 250.05a5.77 5.77 0 011.48.228 150.276 150.276 0 01-32.91-94.064V132.3c-1.367.114-2.733.342-4.1.342v24.028a154.408 154.408 0 0032.114 94.63 4.648 4.648 0 013.416-1.25z" class="prefix__cls-2" data-name="Path 13469" transform="translate(14.633 9.364)"/>
            <path id="prefix__Path_13470" d="M342.738 81.806c0-.342-.114-.569-.114-.911a4.622 4.622 0 01.456-2.164 5.32 5.32 0 01.569-1.139L245.713 27.6 181.6 60.283l1.367 4.1 62.747-31.772z" class="prefix__cls-2" data-name="Path 13470" transform="translate(21.559 -5.166)"/>
            <path id="prefix__Path_13471" d="M360.981 100.6V160.5a149.866 149.866 0 01-65.594 124.241l-51.245 34.619-47.829-32.228a5.165 5.165 0 01-4.214 2.733l14.463 9.794 37.58 25.623 37.58-25.623 16.512-11.274c41.793-28.356 66.846-76.184 66.733-127.316v-60.241a6.916 6.916 0 01-3.986-.228z" class="prefix__cls-2" data-name="Path 13471" transform="translate(23.016 4.965)"/>
            <path id="prefix__Path_13472" d="M150.283 248.339c.456 0 1.025.114 1.367.114a164.577 164.577 0 01-29.153-93.38V132.3c-1.594-.228-3.3-.456-4.9-.8v23.914a170.28 170.28 0 0028.583 94.405 6.609 6.609 0 014.103-1.48z" class="prefix__cls-2" data-name="Path 13472" transform="translate(12.677 9.253)"/>
            <path id="prefix__Path_13473" d="M349.192 64.259L246.588 12.9 175.3 48.544c.911 1.367 1.822 2.733 2.619 4.213l68.669-34.05 101.693 50.449a5.732 5.732 0 01.911-4.897z" class="prefix__cls-2" data-name="Path 13473" transform="translate(20.684 -7.206)"/>
            <path id="prefix__Path_13474" d="M379.155 100.4v58.989a164.7 164.7 0 01-74.135 137.565l-57.85 38.263-57.85-38.263c-4.441-2.961-8.655-6.036-12.754-9.338a5.143 5.143 0 01-4.669 2.505h-.8a161.305 161.305 0 0014.8 11.046l18.676 12.527 42.59 28.356 42.59-28.356 18.676-12.527a169.622 169.622 0 0075.615-141.209v-58.647a7.464 7.464 0 01-4.889-.911z" class="prefix__cls-2" data-name="Path 13474" transform="translate(20.101 4.937)"/>
            <path id="prefix__Path_13475" d="M136.441 19.6a64.341 64.341 0 1064.341 64.341A64.347 64.347 0 00136.441 19.6zm0 124.013a59.672 59.672 0 1159.672-59.672 59.657 59.657 0 01-59.672 59.672z" class="prefix__cls-2" data-name="Path 13475" transform="translate(6.362 -6.276)"/>
            <path id="prefix__Path_13476" d="M161.8 43.2l-40.545 40.541-.114-.228v.228l-14.69-14.69L88.8 86.7l32 32 58.192-58.192zM94.836 86.474l11.616-11.616 14.576 14.576L161.8 48.666l11.616 11.616-52.384 52.384z" class="prefix__cls-2" data-name="Path 13476" transform="translate(8.68 -3.001)"/>
            <path id="prefix__Path_13477" d="M290.229 148.9a2.162 2.162 0 00-2.164 2.164 2.619 2.619 0 11-5.238 0 2.164 2.164 0 00-4.327 0 6.947 6.947 0 0013.893 0 2.162 2.162 0 00-2.164-2.164z" class="prefix__cls-2" data-name="Path 13477" transform="translate(35.007 11.668)"/>
            <g id="prefix__Group_3787" data-name="Group 3787" transform="translate(139.273 257.479)">
                <path id="prefix__Path_13478" d="M248.944 234H130.625a5.1 5.1 0 00-5.125 5.125v28.47a5.1 5.1 0 005.125 5.125h118.319a5.1 5.1 0 005.125-5.125v-28.47a5.177 5.177 0 00-5.125-5.125zm.8 32.455a2.162 2.162 0 01-2.164 2.164H131.991a2.162 2.162 0 01-2.164-2.164v-26.192a2.162 2.162 0 012.164-2.164h115.586a2.162 2.162 0 012.164 2.164z" class="prefix__cls-2" data-name="Path 13478" transform="translate(-125.5 -234)"/>
                <path id="prefix__Rectangle_2941" d="M0 0H4.669V4.669H0z" class="prefix__cls-2" data-name="Rectangle 2941" transform="translate(15.146 16.968)"/>
                <path id="prefix__Rectangle_2942" d="M0 0H4.669V4.669H0z" class="prefix__cls-2" data-name="Rectangle 2942" transform="translate(24.37 16.968)"/>
                <path id="prefix__Rectangle_2943" d="M0 0H4.669V4.669H0z" class="prefix__cls-2" data-name="Rectangle 2943" transform="translate(33.594 16.968)"/>
                <path id="prefix__Rectangle_2944" d="M0 0H4.669V4.669H0z" class="prefix__cls-2" data-name="Rectangle 2944" transform="translate(42.818 16.968)"/>
                <path id="prefix__Rectangle_2945" d="M0 0H4.669V4.669H0z" class="prefix__cls-2" data-name="Rectangle 2945" transform="translate(52.156 16.968)"/>
            </g>
            <path id="prefix__Path_13479" d="M365 112h28.925v4.783H365z" class="prefix__cls-2" data-name="Path 13479" transform="translate(47.011 6.547)"/>
            <path id="prefix__Path_13480" d="M365 120.5h19.245v4.783H365z" class="prefix__cls-2" data-name="Path 13480" transform="translate(47.011 7.727)"/>
            <path id="prefix__Path_13481" d="M365 129h9.68v4.783H365z" class="prefix__cls-2" data-name="Path 13481" transform="translate(47.011 8.906)"/>
            <g id="prefix__Group_3788" data-name="Group 3788" transform="translate(362.816 40.199)">
                <path id="prefix__Path_13482" d="M357 94.148a11.555 11.555 0 00-4.9-9.452 6.448 6.448 0 00.342-2.05 6.947 6.947 0 00-13.893 0 6.449 6.449 0 00.342 2.05 11.265 11.265 0 00-4.9 9.452 2.284 2.284 0 002.278 2.278h18.448A2.15 2.15 0 00357 94.148zm-5.011-2.278H338.9a6.886 6.886 0 013.872-4.1l.683-.342a2.445 2.445 0 00.228-3.3 2.4 2.4 0 01-.569-1.48 2.278 2.278 0 114.555 0 2.4 2.4 0 01-.569 1.48c-.114.228-.342.456-.342.683a2.311 2.311 0 001.253 2.961 7.058 7.058 0 013.982 4.099z" class="prefix__cls-2" data-name="Path 13482" transform="translate(-320.107 -38.69)"/>
                <path id="prefix__Path_13483" d="M321.8 73.264v34.619a2.284 2.284 0 002.278 2.278h46.235a2.284 2.284 0 002.278-2.278V73.264a2.284 2.284 0 00-2.278-2.278h-30.065V64.04a6.947 6.947 0 0113.893 0 2.284 2.284 0 002.278 2.278h9.224a2.284 2.284 0 002.278-2.278 20.84 20.84 0 10-41.679 0v6.947h-2.278a2.264 2.264 0 00-2.164 2.277zm13.779-9.224v6.947h-4.669V64.04a16.2 16.2 0 0132.228-2.391h-4.669a11.567 11.567 0 00-11.274-9.224 11.739 11.739 0 00-11.616 11.615zm-9.224 11.5h41.566V105.6h-41.68V75.541z" class="prefix__cls-2" data-name="Path 13483" transform="translate(-321.8 -43.2)"/>
            </g>
            <path id="prefix__Path_13484" d="M351.4 91.3h-13.1a6.886 6.886 0 013.872-4.1l.683-.342a2.445 2.445 0 00.228-3.3 2.4 2.4 0 01-.569-1.48 2.278 2.278 0 114.555 0 2.4 2.4 0 01-.569 1.48c-.114.228-.342.456-.342.683a2.311 2.311 0 001.252 2.959 7.058 7.058 0 013.99 4.1z" class="prefix__cls-1" data-name="Path 13484" transform="translate(43.306 2.078)"/>
            <g id="prefix__Group_3789" data-name="Group 3789">
                <path id="prefix__Path_13485" d="M175.758 47.656L232.469 19.3h-.569A88.236 88.236 0 00172 42.645c1.253 1.594 2.505 3.302 3.758 5.011z" class="prefix__cls-4" data-name="Path 13485" transform="translate(20.226 -6.318)"/>
                <path id="prefix__Path_13486" d="M227.882 315.814l-18.676-12.527a144.3 144.3 0 01-13.324-9.907H147.6a5.1 5.1 0 01-5.125-5.125v-28.47a5.1 5.1 0 015.125-5.125h13.551a169.5 169.5 0 01-27.559-92.7v-23.91a68.523 68.523 0 01-8.313-2.164c-1.48 8.769-2.391 14.235-2.619 13.665-.114-.569 0-6.036.342-14.463A64.54 64.54 0 0182.231 84.3a121.972 121.972 0 0038.946 236.069l114.22.342z" class="prefix__cls-4" data-name="Path 13486" transform="translate(-3.2 2.703)"/>
                <path id="prefix__Path_13487" d="M470.336 78.96l-79.259 75.615 72.2-85.295A161.7 161.7 0 00260.8 26.69l74.818 37.352a20.8 20.8 0 0141 5.011 2.284 2.284 0 01-2.278 2.278h-9.224a2.284 2.284 0 01-2.278-2.278 6.947 6.947 0 00-13.893 0V76h30.064a2.284 2.284 0 012.278 2.278V112.9a2.284 2.284 0 01-2.278 2.278h-7.174v57.508a169.622 169.622 0 01-75.615 141.209l-18.68 12.522-7.744 5.125 74.476.228v-.456A161.595 161.595 0 00470.336 78.96z" class="prefix__cls-4" data-name="Path 13487" transform="translate(32.55 -7.9)"/>
            </g>
        </svg>
        </div>
        <div class="right">
          <h1>Authentication Passed!</h1>
          <p>Congratulations! Authentication with the CLI has successfully passed. You may now close this browser window and continue through the CLI.</p>
          <p class="links">Other Links:</p>
          <div class="buttons">
            <button class="blue"><a href="https://app.provendb.com/app/dashboard" >ProvenDB UI</a></button>
            <button><a href="https://provendb.com/homepage">Home</a></button>
          </div>
        </div>
      </div>
    </body>
  </html>`

	templateLoginFailed = `
	<!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <title>{{.Title}}</title>
      <link href="https://fonts.googleapis.com/css?family=Poppins&display=swap" rel="stylesheet">
      <style>
      html {
        height: 100%;
        background-color: white;
      }
      body {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-content: center;
        background-color: white;
				padding: 36px;
				padding-bottom: 0px;
				height: 100%;
      }
      h1 {
        width: 435px;
        height: 132px;
        font-family: Poppins;
        font-size: 45px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.51;
        letter-spacing: normal;
        text-align: left;
        color: #4d4f5c;
      }
      p {
        width: 391px;
        height: 95px;
        font-family: Roboto;
        font-size: 15px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.67;
        letter-spacing: normal;
        text-align: left;
        color: #808495;
      }
      .middle {
        display:flex;
        flex-direction:row;
        justify-content: center;
				align-items: center;
				height: 100%;
				
			}
			.left {
				margin-right: 30px;
			}
      .buttons {
        display: flex;
        flex-direction:row;
        justify-content: space-between;

      }
      button {
        width: 176px;
        height: 59px;
        border-radius: 30px;
        border: solid 1px #808495;
        font-family: Poppins;
        font-size: 15px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: 0.87;
        letter-spacing: normal;
        text-align: center;
        color: #808495;
			}
			
			a {
				width: 100%;
				display: flex;
				height: 100%;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				text-decoration: none;
				font-family: Poppins;
        font-size: 15px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: 0.87;
        letter-spacing: normal;
        text-align: center;
        color: #808495;
			}
      .blue {
        border: none;
        background-image: linear-gradient(258deg, #42d9fc 127%, #35b3d4 22%);
			}
			.blue a {
				font-family: Poppins;
        font-size: 15px;
        font-weight: 600;
        font-stretch: normal;
        font-style: normal;
        line-height: 0.87;
        letter-spacing: normal;
        text-align: center;
        color: #ffffff;
			}
      </style>
    </head>
    <body>
      <div class="header">
        <svg xmlns="http://www.w3.org/2000/svg" id="prefix__provendb-logo" width="124.537" height="29.075" viewBox="0 0 124.537 29.075">
          <defs>
              <style>
							#prefix__provendb-logo .prefix__cls-1{fill:#35b3d4 !important}
              #prefix__provendb-logo .prefix__cls-2{fill:#4d4f5c !important}
              </style>
          </defs>
          <path id="prefix__Path_12927" d="M152.4 18.3l-5.64 12.961-4.554-6.27-4.306 2.977 7.251 9.7h4.834l8.443-19.368z" class="prefix__cls-1" data-name="Path 12927" transform="translate(-90.714 -13.466)"/>
          <path id="prefix__Path_12928" d="M270.061 23.83a3.249 3.249 0 00-.175-.35c-.07-.105-.175-.315-.245-.455a3.03 3.03 0 00-.245-.35v-.035a13.179 13.179 0 00-.876-1.086l-.315-.35c-.21-.21-.455-.42-.7-.631a9.635 9.635 0 00-1.156-.806 6.427 6.427 0 00-.841-.455 6.52 6.52 0 00-.876-.35 2.267 2.267 0 00-.455-.14c-.315-.105-.631-.175-.911-.245l-.455-.07h-.035a10.39 10.39 0 00-1.476-.107h-.63a9.727 9.727 0 00-2.207.385l-.315.105a9.126 9.126 0 00-.876.35l-.28.14c-.105.035-.175.105-.28.14s-.175.105-.28.14a9.688 9.688 0 00-4.834 8.267v9.844h4.834V27.508c0-.105.035-.245.035-.35a.211.211 0 01.035-.14 5.056 5.056 0 01.876-1.927 3.063 3.063 0 01.28-.35 4.776 4.776 0 013.573-1.576h.525a.263.263 0 01.175.035h.14l.14.035c.14.035.245.07.385.105l.175.07c.07.035.14.035.175.07l.175.07a6.173 6.173 0 011.3.806l.14.14.28.28a1.925 1.925 0 01.245.315.654.654 0 00.105.14.765.765 0 01.105.175c.035.07.07.105.105.175a3.982 3.982 0 01.455 1.051 4.913 4.913 0 01.21 1.436v9.668h4.834v-9.7a8.036 8.036 0 00-.839-4.206z" class="prefix__cls-2" data-name="Path 12928" transform="translate(-164.584 -13.531)"/>
          <path id="prefix__Path_12929" d="M61.9 27.968v9.668h4.834v-9.668a4.821 4.821 0 014.834-4.834 4.7 4.7 0 011.226.14v-4.9c-.385-.035-.806-.07-1.226-.07a9.71 9.71 0 00-9.668 9.664z" class="prefix__cls-2" data-name="Path 12929" transform="translate(-41.337 -13.466)"/>
          <path id="prefix__Path_12930" d="M345.251 7.408a2.9 2.9 0 00-2.907-2.908H338v9.668h4.344a2.9 2.9 0 002.908-2.908 3 3 0 00-.736-1.927 2.666 2.666 0 00.735-1.925zm-5.29-.981h2.417a.979.979 0 01.981.981.958.958 0 01-.981.981h-2.417zm2.417 5.815h-2.417v-1.927h2.417a.984.984 0 01.911 1.051 1.007 1.007 0 01-.91.876z" class="prefix__cls-2" data-name="Path 12930" transform="translate(-220.717 -4.5)"/>
          <path id="prefix__Path_12931" d="M314.143 4.6H310.5v9.668h3.643a4.834 4.834 0 100-9.668zm0 7.707h-1.681V6.492h1.681a2.908 2.908 0 010 5.815z" class="prefix__cls-2" data-name="Path 12931" transform="translate(-202.851 -4.565)"/>
          <path id="prefix__Path_12932" d="M14.095 4.6H3.2v24.171h4.834v-7.287h6.06a8.484 8.484 0 008.477-8.477A8.38 8.38 0 0014.095 4.6zm0 12.086H8.069V9.434h6.06a3.626 3.626 0 11-.035 7.251z" class="prefix__cls-2" data-name="Path 12932" transform="translate(-3.2 -4.565)"/>
          <path id="prefix__Path_12933" d="M202.868 18.4a9.668 9.668 0 108.968 13.312h-5.745a4.863 4.863 0 01-6.831-.42 5.247 5.247 0 01-.876-1.4h13.977a10.359 10.359 0 00.175-1.822 9.688 9.688 0 00-9.668-9.67zm-4.484 7.847a4.784 4.784 0 016.27-2.662 4.843 4.843 0 012.662 2.662z" class="prefix__cls-2" data-name="Path 12933" transform="translate(-126.642 -13.531)"/>
          <path id="prefix__Path_12934" d="M106.2 23.27a4.8 4.8 0 014.624 3.468l4.1-2.837a9.667 9.667 0 10-4.484 12.891 9.549 9.549 0 003.433-2.8l-3.153-4.239a4.832 4.832 0 01-9.073-3.328 4.758 4.758 0 014.553-3.155z" class="prefix__cls-2" data-name="Path 12934" transform="translate(-63.852 -13.566)"/>
          <g id="prefix__Group_3497" data-name="Group 3497" transform="translate(42.632 .035)">
              <path id="prefix__Path_12935" d="M129.384 7.017H148.9a2.2 2.2 0 012.2 2.207v1.226a10.814 10.814 0 012.382-1.576V8.7a4.1 4.1 0 00-4.1-4.1h-20.489a4.1 4.1 0 00-3.993 3.153 10 10 0 012.522.42 2.226 2.226 0 011.962-1.156z" class="prefix__cls-1" data-name="Path 12935" transform="translate(-124.9 -4.6)"/>
              <path id="prefix__Path_12936" d="M151.1 70.6v1.331a2.2 2.2 0 01-2.207 2.207h-19.509a2.146 2.146 0 01-1.962-1.226 11.844 11.844 0 01-2.522.385 4.1 4.1 0 004.029 3.223h20.493a4.1 4.1 0 004.1-4.1v-.28a12.326 12.326 0 01-2.422-1.54z" class="prefix__cls-1" data-name="Path 12936" transform="translate(-124.9 -47.48)"/>
          </g>
      </svg>
      </div>
      <div class="middle">
        <div class="left">
          <svg xmlns="http://www.w3.org/2000/svg" id="prefix__authentication-fail-icon" width="530.9" height="347.175" viewBox="0 0 530.9 347.175">
            <defs>
                <style>
                    #prefix__authentication-fail-icon .prefix__cls-1{fill:#4d4f5c;opacity:.03}
                    #prefix__authentication-fail-icon .prefix__cls-2{fill:#fbdfe3}
                    #prefix__authentication-fail-icon .prefix__cls-3{fill:#f06465}
                </style>
            </defs>
            <g id="prefix__Group_3791" data-name="Group 3791">
                <path id="prefix__Path_13488" d="M175.159 47.862L231.882 19.5h-.57A88.255 88.255 0 00171.4 42.85c1.253 1.595 2.506 3.189 3.759 5.012z" class="prefix__cls-1" data-name="Path 13488" transform="translate(20.981 -6.401)"/>
                <path id="prefix__Path_13489" d="M227.344 316.064l-18.68-12.529a144.33 144.33 0 01-13.327-9.91h-48.295a5.1 5.1 0 01-5.126-5.126v-28.475a5.1 5.1 0 015.126-5.126H160.6a169.539 169.539 0 01-27.564-92.717v-23.92a68.538 68.538 0 01-8.315-2.164c-1.481 8.77-2.392 14.238-2.62 13.668-.114-.57 0-6.037.342-14.466A64.554 64.554 0 0181.662 84.5 121.972 121.972 0 00120.5 320.62l114.244.342z" class="prefix__cls-1" data-name="Path 13489" transform="translate(-2.5 2.635)"/>
                <g id="prefix__Group_3790" data-name="Group 3790" transform="translate(293.413)">
                    <path id="prefix__Path_13490" d="M344.348 55.6a6.9 6.9 0 00-6.948 6.948V69.5h13.9v-6.952a7.051 7.051 0 00-6.952-6.948z" class="prefix__cls-1" data-name="Path 13490" transform="translate(-249.353 -1.382)"/>
                    <path id="prefix__Path_13491" d="M469.795 79.189l-79.277 75.631 72.214-85.313A161.771 161.771 0 00260.1 26.794l74.834 37.36a20.762 20.762 0 0140.891 3.646h.114V76h2.278a2.285 2.285 0 012.278 2.278V112.9a2.285 2.285 0 01-2.278 2.278h-7.176V172.7a169.658 169.658 0 01-75.631 141.242l-18.68 12.529-7.745 5.126 74.492.228v-.456a161.715 161.715 0 00126.318-252.18z" class="prefix__cls-1" data-name="Path 13491" transform="translate(-260.1 -8)"/>
                </g>
            </g>
            <g id="prefix__Group_3792" data-name="Group 3792" transform="translate(267.785 27.451)">
                <path id="prefix__Path_13492" d="M354.35 168.327v-56.381h-18.908a2.285 2.285 0 01-2.278-2.278V80.509l-46.472-23.464L237.6 32.1v217.44h94.2c.8-1.253 1.481-2.506 2.164-3.645h-7.745v-6.72h11.39c.8-1.481 1.481-2.961 2.164-4.442h-13.215v-15.947a2.278 2.278 0 00-4.556 0v26.425h-63.216v-26.539a2.259 2.259 0 00-2.392-2.05 2.3 2.3 0 00-2.05 2.05v15.946H240.9v-2.05h11.28v-36.676a18.859 18.859 0 016.151-1.595l14.352-1.253a2.133 2.133 0 00.57 2.278 27.012 27.012 0 0017.427 7.518 27.477 27.477 0 0017.427-7.4 2.373 2.373 0 00.57-2.278l14.352 1.253a18.936 18.936 0 0117.2 16.744h.114v22.553a150.993 150.993 0 0014.01-62.874h.114v-.683l-.114-1.822zm-100.12 70.848v6.037h-13.44v-6.037zM263.8 155a13.665 13.665 0 01-.57-4.1c0-3.645.8-4.328.8-4.328a3.23 3.23 0 011.481.456 78.607 78.607 0 00.911 11.618A8.385 8.385 0 01263.8 155zm5.581-16.4h-5.012c-.114-.8-.342-1.595-.456-2.62v-4.556a18.083 18.083 0 0118.224-18h33.943v22.211h-.114v.342h-7.746c-9.682-7.631-27.223-5.923-34.626-4.9a4.92 4.92 0 00-4.214 4.9v2.62zm1.025 11.96a9.206 9.206 0 01.114-1.709h12.757v4.442a2.34 2.34 0 01-2.164 2.278h-8.773a2.423 2.423 0 01-1.709-.8v-.114c.001-.34-.113-1.934-.231-4.098zm20.047 47.725a21.756 21.756 0 01-12.985-5.126c.228-.683.57-1.139.8-1.936v-.114a41.723 41.723 0 002.278-9 19.652 19.652 0 0019.705 0 61.627 61.627 0 002.392 9 13.1 13.1 0 00.683 1.936 20.886 20.886 0 01-12.875 5.239zm18.224-36.791a32.806 32.806 0 01-2.278 6.379 42.357 42.357 0 01-2.164 3.873h.114c-3.417 5.24-7.859 8.087-13.1 8.429h-1.025c-5.467 0-10.137-2.62-13.668-7.859a41.48 41.48 0 01-2.62-4.442c-.456-1.025-.911-2.05-1.253-3.075s-.683-2.164-1.025-3.3c-.114-.456-.228-.911-.342-1.481v-.118h9.568a6.685 6.685 0 006.606-6.606v-3.3a4.182 4.182 0 012.278-1.025 4.584 4.584 0 012.278 1.025v3.417a6.685 6.685 0 006.606 6.606h8.771a5.545 5.545 0 001.367-.114h.342zm.683-7.176a2 2 0 01-1.936 1.253h-8.771a2.362 2.362 0 01-2.278-2.278v-4.443h13.1a29.242 29.242 0 01-.116 5.467zm1.139-9.568c-.683-.228-1.025-.342-1.025-.114H294.1a2.249 2.249 0 00-1.595.683 6.039 6.039 0 00-5.581 0 2.249 2.249 0 00-1.595-.683h-15.267v-.8h1.367a2.721 2.721 0 001.595-.57 2.442 2.442 0 001.253-2.164v-5.354c0-.114 0-.114.114-.114a80.842 80.842 0 0115.719-.8c5.923.456 10.593 1.709 13.9 3.759h.114c.8.57 1.481 1.139 2.164 1.709.114.114.342.228.456.342a2.721 2.721 0 001.595.57h.683a1.234 1.234 0 011.253 0h.57zm6.72 5.923c0 4.442-1.481 6.834-3.189 7.973a92.023 92.023 0 00.911-9.8v-1.709a3.53 3.53 0 011.481-.683s.114 0 .114.228c.342.57.683 1.595.683 3.987z" class="prefix__cls-2" data-name="Path 13492" transform="translate(-237.6 -32.1)"/>
            </g>
            <path id="prefix__Path_13493" d="M250.74 268.4c0 .683-1.025 1.367-2.278 1.367H128.978c-1.253 0-2.278-.569-2.278-1.367v-15.833c0-.683 1.025-1.367 2.278-1.367h119.484c1.253 0 2.278.569 2.278 1.367z" class="prefix__cls-2" data-name="Path 13493" transform="translate(14.767 25.811)"/>
            <path id="prefix__Path_13494" d="M140.615 23.9C110.2 23.9 85.6 50.667 85.6 83.585c0 33.032 24.6 59.685 55.015 59.685s55.015-26.77 55.015-59.685c.114-33.032-24.603-59.685-55.015-59.685zm18.452 85.655l-6.037 6.037-20.274-20.161-2.848 2.848-17.313 17.313-5.467-5.467-6.037-6.037 17.427-17.428 2.848-2.848-20.389-20.16 11.5-11.5 20.275 20.275 2.848-2.848 17.313-17.313 11.5 11.5-17.306 17.313-2.848 2.848 20.161 20.161-5.353 5.467z" class="prefix__cls-2" data-name="Path 13494" transform="translate(9.053 -5.789)"/>
            <g id="prefix__Group_3557_3_" transform="translate(148.855 104.195)">
                <g id="prefix__Group_3525_3_">
                    <path id="prefix__Path_13130_3_" d="M57.7-32.1v71.531h41.233l3.075-24.489h14.01l3.075 24.489h55.129V-32.1z" class="prefix__cls-2" transform="translate(-43.69 81.998)"/>
                    <path id="prefix__Path_13131_3_" d="M115.067 5.7H94.451L88.3 51.489h32.8zM97.64 9.687h14.01l4.9 39.3H92.856z" class="prefix__cls-3" transform="translate(-39.436 87.253)"/>
                    <path id="prefix__Path_13134_3_" d="M190.02-71.986a22.482 22.482 0 00-6.72 1.139v16.288c8.2-1.025 23.806-1.936 32.69 5.126h7.745V-72.1z" class="prefix__cls-2" transform="translate(-26.228 76.437)"/>
                    <path id="prefix__Path_13495" d="M96.958 33.114a5.5 5.5 0 01.8-4.214H54.7a6.737 6.737 0 01.57 4.214z" class="prefix__cls-3" data-name="Path 13495" transform="translate(-44.107 90.479)"/>
                    <path id="prefix__Path_13496" d="M271.155 25.474a23.292 23.292 0 00-21.186-20.388l-16.63-1.481a44.179 44.179 0 01-2.05-9.34 32.038 32.038 0 006.379-9.112 48.873 48.873 0 002.164-5.7c3.075-.8 9.112-3.531 9.112-13.327a11.4 11.4 0 00-1.595-6.606c-.114-.228-.342-.456-.456-.683a24.281 24.281 0 00.911-6.948v-25.51a2.24 2.24 0 00-2.392-2.278l-40.663.456a23.022 23.022 0 00-18.68 22.325v5.24a6.494 6.494 0 00.114 1.481 17 17 0 00.228 2.392v.114c.114.57.228 1.253.342 1.822v.114c.114.57.342 1.139.456 1.822a11.112 11.112 0 00-1.481 6.606 19.949 19.949 0 00.57 4.9 11.315 11.315 0 008.429 8.543 27.48 27.48 0 00.911 2.848c.342 1.025.8 1.936 1.253 2.961a30.274 30.274 0 006.492 9.112 43.166 43.166 0 01-2.05 9.226L184.7 5.541a20.379 20.379 0 00-5.809 1.253v-35.651l-133.38-.683a6.278 6.278 0 01-.114 5.7 8.621 8.621 0 011.709.114V-25.1h127.232v68.685h-53.079a5.461 5.461 0 01.341 4.215h41.574v12.642H63.169a6.349 6.349 0 01.8 4.328h196.71a5.8 5.8 0 011.139-4.1h-8.543v-6.264h12.185a4.778 4.778 0 011.025-1.595 5.421 5.421 0 012.734-4.1 5.757 5.757 0 012.164-3.417c-.114-9.455-.228-19.82-.228-19.82zM218.19-4.824h-1.025c-5.467 0-10.137-2.62-13.668-7.859a41.482 41.482 0 01-2.62-4.442c-.456-1.025-.911-2.05-1.253-3.075s-.683-2.164-1.025-3.3c-.114-.456-.228-.911-.342-1.481v-.119h9.568a6.685 6.685 0 006.606-6.606v-3.3a4.182 4.182 0 012.278-1.025 4.584 4.584 0 012.278 1.025v3.417a6.685 6.685 0 006.606 6.606h8.77a5.545 5.545 0 001.367-.114h.342l-.342 1.595a32.8 32.8 0 01-2.278 6.379 42.356 42.356 0 01-2.164 3.873h.114c-3.416 5.35-7.858 8.085-13.212 8.426zm12.074 12.985a21.854 21.854 0 01-12.871 5.24 21.756 21.756 0 01-12.985-5.126c.228-.683.57-1.139.8-1.936v-.114a41.722 41.722 0 002.278-9 19.652 19.652 0 0019.705 0 61.626 61.626 0 002.392 9 5.607 5.607 0 00.683 1.936zm-36.791-34.4A7.537 7.537 0 01190.74-30a13.665 13.665 0 01-.57-4.1c0-3.645.8-4.328.8-4.328a3.23 3.23 0 011.481.456 67.059 67.059 0 001.022 11.735zm49.889-12.074s.114 0 .114.228a8.4 8.4 0 01.683 3.987c0 4.442-1.481 6.834-3.189 7.973a92.035 92.035 0 00.911-9.8v-1.709a3.53 3.53 0 011.482-.677zm-46.017 3.987a9.206 9.206 0 01.114-1.709h12.757v4.442a2.34 2.34 0 01-2.164 2.278h-8.771a2.422 2.422 0 01-1.709-.8v-.114c.002-.337-.112-2.045-.226-4.096zm-.456-5.923v-.8h1.367a2.722 2.722 0 001.595-.57 2.442 2.442 0 001.253-2.164v-5.354c0-.114 0-.114.114-.114a80.841 80.841 0 0115.719-.8c5.923.456 10.593 1.709 13.9 3.759h.114c.8.57 1.481 1.139 2.164 1.709.114.114.342.228.456.342a2.721 2.721 0 001.595.57h.683a1.234 1.234 0 011.253 0h.57l-.228 3.417c-.683-.228-1.025-.342-1.025-.114h-15.381a2.249 2.249 0 00-1.595.683 6.039 6.039 0 00-5.581 0 2.249 2.249 0 00-1.595-.683H196.89zm26.425 4.214h13.1a27.7 27.7 0 01-.228 5.353 2 2 0 01-1.936 1.253h-8.77a2.362 2.362 0 01-2.28-2.271v-4.328zm-32.46-17.425a18.083 18.083 0 0118.224-18h33.943v22.211h-.114v.342h-7.745c-9.682-7.631-27.223-5.923-34.626-4.9a4.92 4.92 0 00-4.214 4.9v2.62h-5.012c-.114-.8-.342-1.595-.456-2.62v-4.553zm-9.8 113.789h-13.437v-6.037h13.441zm72.446-10.48V33.9a2.278 2.278 0 00-4.556 0v26.429h-63.216V33.675a2.259 2.259 0 00-2.392-2.05 2.3 2.3 0 00-2.05 2.05v15.947h-13.441v-2.05h11.276V11.009a18.859 18.859 0 016.151-1.595l14.352-1.253a2.133 2.133 0 00.57 2.278 27.012 27.012 0 0017.427 7.518 27.477 27.477 0 0017.427-7.4 2.373 2.373 0 00.57-2.278l14.352 1.253a18.936 18.936 0 0117.2 16.744h.114v23.46H253.5z" class="prefix__cls-3" data-name="Path 13496" transform="translate(-45.4 75.908)"/>
                </g>
            </g>
            <path id="prefix__Path_13497" d="M166.638 250.275a5.772 5.772 0 011.481.228A150.308 150.308 0 01135.2 156.42V132.5c-1.367.114-2.734.342-4.1.342v24.033a154.441 154.441 0 0032.121 94.653 4.649 4.649 0 013.417-1.253z" class="prefix__cls-3" data-name="Path 13497" transform="translate(15.379 9.309)"/>
            <path id="prefix__Path_13498" d="M342.172 82.018c0-.342-.114-.57-.114-.911a4.622 4.622 0 01.456-2.164 5.319 5.319 0 01.569-1.139l-97.956-50L181 60.6l1.367 4.1 62.76-31.779z" class="prefix__cls-3" data-name="Path 13498" transform="translate(22.316 -5.247)"/>
            <path id="prefix__Path_13499" d="M360.418 100.8V160.712A149.9 149.9 0 01294.81 284.98l-51.256 34.626-47.839-32.234a5.166 5.166 0 01-4.214 2.734l14.466 9.8 37.588 25.628 37.586-25.634 16.516-11.276c41.8-28.362 66.861-76.2 66.747-127.343v-60.253a6.917 6.917 0 01-3.986-.228z" class="prefix__cls-3" data-name="Path 13499" transform="translate(23.776 4.902)"/>
            <path id="prefix__Path_13500" d="M149.69 248.564c.456 0 1.025.114 1.367.114a164.612 164.612 0 01-29.159-93.4V132.5c-1.595-.228-3.3-.456-4.9-.8v23.92a170.317 170.317 0 0028.59 94.425 6.611 6.611 0 014.102-1.481z" class="prefix__cls-3" data-name="Path 13500" transform="translate(13.418 9.197)"/>
            <path id="prefix__Path_13501" d="M348.629 64.47L246 13.1l-71.3 35.652c.911 1.367 1.822 2.734 2.62 4.214L246 18.909l101.718 50.459a5.733 5.733 0 01.911-4.898z" class="prefix__cls-3" data-name="Path 13501" transform="translate(21.44 -7.291)"/>
            <path id="prefix__Path_13502" d="M378.6 100.6v59.001A164.732 164.732 0 01304.449 297.2l-57.863 38.271-57.862-38.271c-4.442-2.961-8.657-6.037-12.757-9.34a5.144 5.144 0 01-4.67 2.506h-.8a161.339 161.339 0 0014.807 11.049l18.68 12.529 42.6 28.362 42.6-28.362 18.68-12.529A169.658 169.658 0 00383.5 160.171v-58.66a7.465 7.465 0 01-4.9-.911z" class="prefix__cls-3" data-name="Path 13502" transform="translate(20.856 4.874)"/>
            <path id="prefix__Path_13503" d="M135.855 19.8a64.355 64.355 0 1064.355 64.355A64.361 64.361 0 00135.855 19.8zm0 124.04a59.685 59.685 0 1159.685-59.685 59.67 59.67 0 01-59.685 59.685z" class="prefix__cls-3" data-name="Path 13503" transform="translate(7.093 -6.359)"/>
            <path id="prefix__Path_13504" d="M280.064 158.212a2.163 2.163 0 002.164-2.164 2.62 2.62 0 115.239 0 2.163 2.163 0 002.164 2.164 2.24 2.24 0 002.164-2.164 6.948 6.948 0 10-13.9 0 2.163 2.163 0 002.169 2.164z" class="prefix__cls-3" data-name="Path 13504" transform="translate(35.788 11.617)"/>
            <g id="prefix__Group_3793" data-name="Group 3793" transform="translate(139.303 257.648)">
                <path id="prefix__Path_13505" d="M248.27 234.2H129.926a5.1 5.1 0 00-5.126 5.126V267.8a5.1 5.1 0 005.126 5.126H248.27a5.1 5.1 0 005.13-5.126v-28.474a5.1 5.1 0 00-5.13-5.126zm.911 32.462a2.163 2.163 0 01-2.164 2.164H131.292a2.163 2.163 0 01-2.164-2.164v-26.2a2.163 2.163 0 012.164-2.164H246.9a2.163 2.163 0 012.164 2.164v26.2z" class="prefix__cls-3" data-name="Path 13505" transform="translate(-124.8 -234.2)"/>
                <path id="prefix__Rectangle_2946" d="M0 0H4.67V4.67H0z" class="prefix__cls-3" data-name="Rectangle 2946" transform="translate(15.263 17.085)"/>
                <path id="prefix__Rectangle_2947" d="M0 0H4.67V4.67H0z" class="prefix__cls-3" data-name="Rectangle 2947" transform="translate(24.489 17.085)"/>
                <path id="prefix__Rectangle_2948" d="M0 0H4.67V4.67H0z" class="prefix__cls-3" data-name="Rectangle 2948" transform="translate(33.715 17.085)"/>
                <path id="prefix__Rectangle_2949" d="M0 0H4.67V4.67H0z" class="prefix__cls-3" data-name="Rectangle 2949" transform="translate(42.941 17.085)"/>
                <path id="prefix__Rectangle_2950" d="M0 0H4.67V4.67H0z" class="prefix__cls-3" data-name="Rectangle 2950" transform="translate(52.167 17.085)"/>
            </g>
            <path id="prefix__Path_13506" d="M364.3 112.2h28.931v4.784H364.3z" class="prefix__cls-3" data-name="Path 13506" transform="translate(47.799 6.486)"/>
            <path id="prefix__Path_13507" d="M364.3 120.7h19.25v4.784H364.3z" class="prefix__cls-3" data-name="Path 13507" transform="translate(47.799 7.668)"/>
            <path id="prefix__Path_13508" d="M364.3 129.2h9.682v4.784H364.3z" class="prefix__cls-3" data-name="Path 13508" transform="translate(47.799 8.85)"/>
            <g id="prefix__Group_3794" data-name="Group 3794" transform="translate(363.235 40.435)">
                <path id="prefix__Path_13509" d="M356.409 94.452a11.558 11.558 0 00-4.9-9.454 6.449 6.449 0 00.342-2.05 6.948 6.948 0 00-13.9 0A6.45 6.45 0 00338.3 85a11.267 11.267 0 00-4.9 9.454 2.285 2.285 0 002.278 2.278h18.452a2.285 2.285 0 002.279-2.28zM351.4 92.06h-13.1a6.887 6.887 0 013.873-4.1l.683-.342a2.446 2.446 0 00.228-3.3 2.4 2.4 0 01-.57-1.481 2.278 2.278 0 114.556 0 2.4 2.4 0 01-.57 1.481c-.114.228-.342.456-.342.683a2.312 2.312 0 001.253 2.961 7.06 7.06 0 013.989 4.098z" class="prefix__cls-3" data-name="Path 13509" transform="translate(-319.732 -38.982)"/>
                <path id="prefix__Path_13510" d="M371.289 71.862a2.249 2.249 0 00-1.595-.683h-2.278V64.23a21.184 21.184 0 00-3.531-11.618 22.622 22.622 0 00-2.506-3.075 16.426 16.426 0 00-3.075-2.506 20.294 20.294 0 00-11.618-3.531 13.785 13.785 0 00-2.164.114.685.685 0 00-.456.114c-.57.114-1.025.114-1.595.228a1.619 1.619 0 00-.683.228c-.456.114-.911.228-1.253.342a.863.863 0 00-.456.228 7.908 7.908 0 00-1.481.57c-.114 0-.228.114-.342.228a20.894 20.894 0 00-4.784 2.961l-.114.114c-.456.456-.911.8-1.367 1.253a20.751 20.751 0 00-6.037 14.693v6.947h-2.278a2.285 2.285 0 00-2.276 2.28v34.626a2.285 2.285 0 002.278 2.278h46.244a2.285 2.285 0 002.278-2.278v-34.97a4.47 4.47 0 00-.911-1.594zm-41-7.631a16.217 16.217 0 015.581-12.188 6.26 6.26 0 011.025-.8l.228-.228a8.493 8.493 0 011.367-.8c.456-.228 1.025-.57 1.481-.8h.114c.456-.228.911-.342 1.367-.57a1.027 1.027 0 01.57-.114 3.326 3.326 0 011.025-.228c.228 0 .456-.114.683-.114.342 0 .683-.114.911-.114a1.445 1.445 0 00.683-.114h1.595c.57 0 1.139.114 1.709.114a.861.861 0 01.456.114 2.146 2.146 0 01.911.228c.228 0 .342.114.57.114.228.114.57.114.8.228s.456.114.683.228.456.114.57.228l.683.342c.114.114.342.114.456.228a2.855 2.855 0 01.8.456c.114.114.228.114.342.228a4.822 4.822 0 01.8.57c.114 0 .114.114.228.114.342.228.57.456.911.683l.114.114c.342.228.569.57.911.8a15.758 15.758 0 013.645 5.7 16.407 16.407 0 011.025 5.809v6.948h-4.67v-6.949a12.415 12.415 0 00-1.139-5.012.112.112 0 00-.114-.114 12.2 12.2 0 00-1.709-2.506l-.228-.228a6.873 6.873 0 00-.911-.911l-.114-.114c-.342-.342-.8-.57-1.139-.911-.114 0-.114-.114-.228-.114a5.32 5.32 0 00-1.139-.57c-.114 0-.114-.114-.228-.114-.456-.228-.911-.342-1.367-.57h-.228a4.843 4.843 0 00-1.253-.228h-.342a6.5 6.5 0 00-1.481-.114h-1.367c-.228 0-.456.114-.683.114-.114 0-.342.114-.456.114s-.342.114-.456.114c-.228 0-.342.114-.57.114-.114 0-.114 0-.228.114a6.968 6.968 0 00-1.367.57h-.114l-.683.342c-.114 0-.114.114-.228.114a1.137 1.137 0 00-.569.456 11.533 11.533 0 00-4.784 9.34v6.948h-4.67V64.23zm19.933 6.948h-10.598V64.23a6.934 6.934 0 014.556-6.492c.342-.114.8-.228 1.139-.342h.114a3.875 3.875 0 011.139-.114 6.9 6.9 0 016.948 6.948v6.948zM367.3 91.111V105.8h-41.572V75.848H367.3v15.263z" class="prefix__cls-3" data-name="Path 13510" transform="translate(-321.4 -43.5)"/>
            </g>
            <path id="prefix__Path_13511" d="M169.317 101.718l-20.5-20.5 20.5-20.5L152.118 43.4l-20.5 20.5-20.5-20.5L93.8 60.6l20.5 20.5-20.5 20.5 17.2 17.317 20.5-20.5 20.5 20.5 17.313-17.2zm-11.39 5.126l-6.037 6.037-20.274-20.161-2.848 2.848-17.313 17.313-5.467-5.467-6.037-6.037 17.427-17.427 2.848-2.848-20.389-20.161 11.5-11.5 20.275 20.275 2.848-2.848 17.313-17.313 11.5 11.5-17.306 17.313-2.848 2.848 20.161 20.161-5.353 5.467z" class="prefix__cls-3" data-name="Path 13511" transform="translate(10.193 -3.078)"/>
            <path id="prefix__Path_13512" d="M350.8 91.5h-13.1a6.887 6.887 0 013.873-4.1l.683-.342a2.446 2.446 0 00.228-3.3 2.4 2.4 0 01-.57-1.481 2.278 2.278 0 114.556 0 2.4 2.4 0 01-.57 1.481c-.114.228-.342.456-.342.683a2.312 2.312 0 001.253 2.961A7.06 7.06 0 01350.8 91.5z" class="prefix__cls-2" data-name="Path 13512" transform="translate(44.101 2.01)"/>
        </svg>
        
        </div>
        <div class="right">
          <h1>Authentication Failed.</h1>
					<p>Oh no! We're sorry, authentication for the CLI has failed. Please try again in your terminal, ensuring you are logging in with a valid ProvenDB account. If problems persist, you can contact support below:  </p>
          <div class="buttons">
            <button class="blue"><a href="https://app.provendb.com/app/signup" >Create Account</a></button>
            <button><a href="https://provendb.readme.io/discuss">Support</a></button>
          </div>
        </div>
      </div>
    
    </body>
  </html>`
)
