describe('relatime', function () {

  var months = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
  function getDateWithMonthFrench(date) {
    return date.getDate() + ' ' + months[date.getMonth()];
  }

  describe('setup()', function () {

    it('should setup relatime parameters', function () {
      relatime.setup({
        locale: 'de',
        tag: 'span',
        classname: 'relative-time',
        refresh: 120
      });
      expect(relatime.locale()).toEqual('de');
    });

  });

  describe('locale()', function () {

    it('should set and get locale', function () {
      expect(relatime.locale()).toBeDefined();
      expect(relatime.locale('de')).toEqual('de');
      expect(relatime.locale()).toEqual('de');
      expect(relatime.locale('fr')).toEqual('fr');
      expect(relatime.locale()).toEqual('fr');
      expect(relatime.locale('en')).toEqual('en');
      expect(relatime.locale()).toEqual('en');
    });

  });

  describe('start()', function () {

    it('should start the auto-update of displayed dates', function () {
      expect(relatime.started()).toBeFalsy();
      relatime.start();
      expect(relatime.started()).toBeTruthy();
      relatime.locale('fr');
      relatime.start({locale: 'de'});
      expect(relatime.locale()).toEqual('de');
    });

  });

  describe('stop()', function () {

    it('should stop the auto-update of displayed dates', function () {
      relatime.start();
      relatime.stop();
      expect(relatime.started()).toBeFalsy();
    });

  });

  describe('text()', function () {

    it('should return a relative representation of date', function () {
      var dates = {
        pastDays: new Date(Date.now() - 10 * 60 * 60 * 24 * 1000),
        pastHours: new Date(Date.now() - 10 * 60 * 60 * 1000),
        pastMinutes: new Date(Date.now() - 10 * 60 * 1000),
        pastSeconds: new Date(Date.now() - 10 * 1000),
        now: new Date(),
        futureSeconds: new Date(Date.now() + 10 * 1000),
        futureMinutes: new Date(Date.now() + 10 * 60 * 1000),
        futureHours: new Date(Date.now() + 10 * 60 * 60 * 1000),
        futureDays: new Date(Date.now() + 10 * 60 * 60 * 24 * 1000)
      };
      // Set locale to be sure
      relatime.locale('fr');
      // Past days
      expect(relatime.text(dates.pastDays)).toEqual(getDateWithMonthFrench(dates.pastDays));
      // Past hours
      expect(relatime.text(dates.pastHours)).toEqual('10 h');
      // Past minutes
      expect(relatime.text(dates.pastMinutes)).toEqual('10 min');
      // Past seconds
      expect(relatime.text(dates.pastSeconds)).toEqual('maintenant');
      // Now
      expect(relatime.text(dates.now)).toEqual('maintenant');
      // Now with string
      expect(relatime.text((dates.now).toString())).toEqual('maintenant');
      // Future seconds
      expect(relatime.text(dates.futureSeconds)).toEqual(getDateWithMonthFrench(dates.futureSeconds));
      // Future minutes
      expect(relatime.text(dates.futureMinutes)).toEqual(getDateWithMonthFrench(dates.futureMinutes));
      // Future hours
      expect(relatime.text(dates.futureHours)).toEqual(getDateWithMonthFrench(dates.futureHours));
      // Future days
      expect(relatime.text(dates.futureDays)).toEqual(getDateWithMonthFrench(dates.futureDays));
    });

  });

  describe('html()', function () {

    it('should return a relative representation of date embedded in an auto-updated time tag', function () {
      var now = new Date();
      expect(relatime.html(new Date('2013-04-23T13:27:32.631Z'))).toEqual('<span title="23/4/2013 15:27:32">23 avr.</span>');
      expect(relatime.html(now)).toEqual(
        '<span class="relative-time" datetime="%datetime" title="%day/%month/%year %hours:%minute:%second">maintenant</span>'
          .replace('%datetime', now.toISOString())
          .replace('%day', now.getDate())
          .replace('%month', now.getMonth() + 1)
          .replace('%year', now.getFullYear())
          .replace('%hours', now.getHours())
          .replace('%minute', now.getMinutes())
          .replace('%second', now.getSeconds())
      );
    });

  });

});
