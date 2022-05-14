/* eslint-disable no-unused-vars */
function fnBrowserDetect () {
  let userAgent = navigator.userAgent;
  let browserName;

  if (userAgent.match(/chrome|chromium|crios/i)) {
    return (browserName = 'Chrome');
  } else if (userAgent.match(/firefox|fxios/i)) {
    return (browserName = 'Firefox');
  } else if (userAgent.match(/safari/i)) {
    return (browserName = 'Safari');
  } else if (userAgent.match(/opr\//i)) {
    return (browserName = 'Opera');
  } else if (userAgent.match(/edg/i)) {
    return (browserName = 'Edge');
  } else {
    return (browserName = 'Web');
  }
}

function fnOsDetect() {
  let userAgent = navigator.userAgent;
  let osName;

  if (window.navigator.userAgent.indexOf('Windows NT 10.0') != -1) {
    return (osName = 'Windows 10');
  } else if (window.navigator.userAgent.indexOf('Windows NT 6.3') != -1) {
    return (osName = 'Windows 8.1');
  } else if (window.navigator.userAgent.indexOf('Windows NT 6.2') != -1) {
    return (osName = 'Windows 8');
  } else if (window.navigator.userAgent.indexOf('Windows NT 6.1') != -1) {
    return (osName = 'Windows 7');
  } else if (window.navigator.userAgent.indexOf('Windows NT 6.0') != -1) {
    return (osName = 'Windows Vista');
  } else if (window.navigator.userAgent.indexOf('Windows NT 5.1') != -1) {
    return (osName = 'Windows XP');
  } else if (window.navigator.userAgent.indexOf('Windows NT 5.0') != -1) {
    return (osName = 'Windows 2000');
  } else if (window.navigator.userAgent.indexOf('Mac') != -1) {
    return (osName = 'Mac/iOS');
  } else if (window.navigator.userAgent.indexOf('X11') != -1) {
    return (osName = 'UNIX');
  } else if (window.navigator.userAgent.indexOf('Linux') != -1) {
    return (osName = 'Linux');
  } else {
    return (osName = '')
  }
}

export { fnOsDetect, fnBrowserDetect };
