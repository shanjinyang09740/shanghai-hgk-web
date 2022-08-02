export default {
  /**
   * @desc 动态设置iframe高度
   * @param {String} domId iframe的id
   * @param {String} minHeight 为手动设置的最小高度
   */
   setIframHeightSize(domId, minHeight) {
    var iframe = parent.document.getElementById(domId);
    if (iframe) {
      iframe.onload = function() {
        this.contentWindow.onbeforeunload = function() {
          iframe.style.visibility = "hidden";
          iframe.setAttribute("height", "auto");
        };
        setInterval(function() {
          let iframeHeight = "";
          if (iframe.contentWindow && iframe.contentWindow.document) {
            iframeHeight = iframe.contentWindow.document.body
              ? iframe.contentWindow.document.body.scrollHeight
              : minHeight;
          }
          iframe.style.height =
            (iframeHeight ? iframeHeight : minHeight) + "px";
          iframe.style.visibility = "visible";
        }, 50);
      };
    }
  },
  /**
   * @description 加载iframe，并判断iframe加载成功时机
   * @param {String} domId iframe的id
   */
  loadIframe(domId) {
    let _THIS = this;
    let iframe = parent.document.getElementById(domId);
    let minHeight = 50;
    if (!(/*@cc_on!@*/ 0)) {
      //if not IE
      iframe.onload = function() {
        console.log("Local iframe is now loaded.");
        setInterval(function() {
          _THIS.setIframHeightSize();
          // _THIS.initIframeHeight(iframe, minHeight);
        }, 200);
      };
    } else {
      iframe.onreadystatechange = function() {
        if (iframe.readyState == "complete") {
          console.log("Local iframe is now loaded.");
          setInterval(function() {
            _THIS.initIframeHeight(iframe, minHeight);
          }, 200);
        }
      };
    }
  },
  /**
   * @description iframe自适应高度
   * @param {Object} iframe的dom对象
   * @param {String} minHeight 为手动设置的最小高度
   */
  initIframeHeight(iframe, minHeight) {
    let userAgent = navigator.userAgent;
    let subdoc = iframe.contentDocument || iframe.contentWindow.document;
    let subbody = subdoc.body;
    let realHeight;
    //谷歌浏览器特殊处理
    if (userAgent.indexOf("Chrome") > -1) {
      realHeight = subdoc.documentElement
        ? subdoc.documentElement.scrollHeight
        : 0;
    } else {
      realHeight = subbody ? subbody.scrollHeight : 0;
    }
    if (realHeight < minHeight) {
      iframe.style.height = minHeight + "px";
    } else {
      iframe.style.height = realHeight + "px";
    }
  },
};
