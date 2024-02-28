// 設定管理
import { defu } from "defu";

type BBSsettei = {
  BBS_TITLE: string;
  BBS_TITLE_COLOR: string;
  BBS_BG_COLOR: string;
  BBS_SUBJECT_COLOR: string;
  BBS_NAME_COLOR: string;
  BBS_LINK_COLOR: string;
  BBS_ALINK_COLOR: string;
  BBS_VLINK_COLOR: string;
  BBS_NONAME_NAME: string;
  BBS_SUBJECT_COUNT: number;
  BBS_NAME_COUNT: number;
  BBS_MAIL_COUNT: number;
  BBS_MESSAGE_COUNT: number;
};
type Mainsettei = {
  port: number;
  host: string;
};
// デフォルト設定
const BBSdefaults = {
  BBS_TITLE: "名無しの掲示板", //板の名前
  // "BBS_TITLE_PICTURE": "#",//板の看板画像
  BBS_TITLE_COLOR: "#000000", //タイトルの文字色
  // "BBS_TITLE_LINK": "#",//看板画像を押したときの飛び先
  // "BBS_BG_PICTURE": "#",//背景画像
  BBS_BG_COLOR: "#FFFFFF", //背景画像がない場合の色
  // "BBS_MENU_COLOR": "#CCFFCC",//板名やスレ一覧の色
  // "BBS_MAKETHREAD_COLOR": "#CCFFCC",
  // "BBS_THREAD_COLOR": "#EFEFEF",
  // "BBS_TEXT_COLOR": "#000000",
  BBS_SUBJECT_COLOR: "#FF0000", //スレッドの文字色
  BBS_NAME_COLOR: "#228811", //名前の色
  BBS_LINK_COLOR: "#0000FF", //リンクの色
  BBS_ALINK_COLOR: "#FF0000", //選択時のリンクの色
  BBS_VLINK_COLOR: "#660099", //訪問済みリンクの色
  // "BBS_THREAD_NUMBER": 20,//スレ内容がデモ表示される最大スレッド数(未定)
  // "BBS_CONTENTS_NUMBER": 10,//スレ内容表示で表示される最大レス数(未定)
  BBS_NONAME_NAME: "名無し", //名前欄が空欄のときの名前
  BBS_SUBJECT_COUNT: 64, //スレタイの文字数制限
  BBS_NAME_COUNT: 64, //名前欄の文字数制限
  BBS_MAIL_COUNT: 32, //メール欄の文字数制限
  BBS_MESSAGE_COUNT: 2048, //投稿の文字数制限
  // "BBS_THREAD_TATESUGI": 20,//スレッドの立てすぎ制限
};

const Maindefaults = {
  port: 3000,
  host: "localhost",
};

export function BBSsettei(newSettei: BBSsettei) {
  return defu(newSettei, BBSdefaults);
}

export function Mainsettei(newSettei: Mainsettei) {
  return defu(newSettei, BBSdefaults);
}
