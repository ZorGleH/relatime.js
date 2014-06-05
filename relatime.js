// relatime.js 0.2 - Twitter-like relative date time display and update
// https://github.com/ZorGleH/relatime.js
// ZorGleH 2014

// relatime.js 0.2 - relative date time display and update
// https://github.com/nikopol/relatime.js
// niko 2013
/*
display dates in a relative form and automatically update them every minutes.

methods:

setup(opt)      setup relatime parameters :
                  opt.locale     see locale(lang) below
                  opt.tag        (by default "time")
                  opt.classname  tag.classname (by default "relatime")
                  opt.refresh    auto-updates interval in seconds (by default 60)

locale('fr')    force locale. by default navigator language or en.
                actually en/fr/de are supported.

locale()        return the current locale.

start()         start the auto-update of displayed dates.
                by default auto-updates are automatically started
                when html(date) is called.

start(opt)      same shit but with setup option provided.

stop()          stop the auto-update of displayed dates.

started()       return true if auto-update is started.

text(date)      return a relative representation of date
                date can be a string or a Date object.
                eg: "one hour ago"

html(date)      return a relative representation of date
                embedded in an auto-updated time tag.
                date can be a string or a Date object.
                eg: "<time class="relatime" datetime="2013-11-14T13:24:43.310Z"
                      title="11/14/2013, 2:24:43 PM">one hour ago</time>"
*/

var relatime = (function () {
  'use strict';
  var
    dic = {
      de: {
        now: 'jetzt',
        months: [
          '%d. Jan.', '%d. Feb.', '%d. März', '%d. Apr.', '%d. Mai', '%d. Juni',
          '%d. Juli', '%d. Aug.', '%d. Sep.', '%d. Okt.', '%d. Nov.', '%d. Dez.'
        ]
      },
      en: {
        now: 'now',
        months: [
          'Jan. %d', 'Feb. %d', 'Mar. %d', 'Apr. %d', 'May %d', 'June %d',
          'July. %d', 'Aug. %d', 'Sept. %d', 'Oct. %d', 'Nov. %d', 'Dec. %d'
        ]
      },
      fr: {
        now: 'maintenant',
        months: [
          '%d janv.', '%d févr.', '%d mars', '%d avr.', '%d mai', '%d juin',
          '%d juil.', '%d août', '%d sept.', '%d oct.', '%d nov.', '%d déc.'
        ]
      },
      all: {
        min: '%d min',
        h: '%d h'
      }
    },
    loc = 'en',
    tag = 'time',
    classname = 'relatime',
    timer = false,
    autostart = true,
    interval = 60 * 1000,
    datobj = function (d) {
      return d instanceof Date ? d : new Date(d);
    },
    delta = function (d) {
      var
        d1 = datobj(d),
        d2 = new Date();
      return Math.floor((d2.getTime() - d1.getTime()) / 1000);
    },
    fmt = function (t, n) {
      var date = new Date(n);
      if (t === 'year') {
        return dic[loc].months[date.getMonth()].replace('%d', date.getDate()) + ' ' + date.getFullYear();
      } else if (t !== 'month') {
        n = Math.round(n);
        return dic.all[t].replace('%d', n);
      } else {
        return dic[loc].months[date.getMonth()].replace('%d', date.getDate());
      }
    },
    text = function (d, _) {
      var e = _ || delta(d);
      // Between 1 min ago and now
      if (e >= 0 && e < 60) { return dic[loc].now; }
      // Between 1 min ago and 1 hour ago
      if (e >= 60 && e < 60 * 60) { return fmt('min', e / 60); }
      // Between 1 hour ago and 1 day ago
      if (e >= 60 * 60 && e < 24 * 60 * 60) { return fmt('h', e / (60 * 60)); }
      // Between 1 day ago and 1 year ago
      if (e >= 24 * 60 * 60 && e < 365 * 24 * 60 * 60) { return fmt('month', d) }
      // Else
      return fmt('year', d);

    },
    refresh = function () {
      var e, d, i = 0,
        nl = document.querySelectorAll(tag + '.' + classname);
      while (i < nl.length) {
        e = nl[i];
        d = e.getAttribute('datetime');
        if (d) { e.innerHTML = text(d); }
        ++i;
      }
    },
    locale = function (l) {
      if (l !== undefined && l !== loc && dic[l]) {
        loc = l;
        setTimeout(refresh, 9);
      }
      return loc;
    };
  locale(navigator.language);
  return {
    setup: function (opt) {
      if (opt.tag) { tag = opt.tag; }
      if (opt.classname) { classname = opt.classname; }
      if (opt.locale) { locale(opt.locale); }
      if (opt.interval) {
        interval = 1000 * opt.interval;
        if (this.started()) { this.start(); }
      }
      if (opt.autostart !== undefined) { autostart = opt.autostart; }
      return this;
    },
    locale: locale,
    start: function (opt) {
      if (opt) { this.setup(opt); }
      this.stop();
      if (interval > 500) { refresh(); }
      timer = setInterval(refresh, interval);
      return this;
    },
    started: function () {
      return timer !== false;
    },
    stop: function () {
      if (timer !== false) {
        clearInterval(timer);
        timer = false;
      }
      return this;
    },
    text: text,
    html: function (s) {
      var
        d = datobj(s),
        e = delta(d),
        t = text(d, e);
      if (e > 2592000) { return '<' + tag + ' title="' + d.toLocaleString() + '">' + t + '</' + tag + '>'; }
      if (autostart && !this.started()) { this.start(); }
      return '<' + tag + ' class="' + classname + '" datetime="' + d.toISOString() + '" title="' + d.toLocaleString() +
        '">' + t + '</' + tag + '>';
    }
  };
}());
