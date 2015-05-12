;(function(exports) {
  var valid_calendars = ['google', 'ical', 'outlook', 'yahoo'];
  var MS_IN_MINUTES = 60 * 1000;

  var formatTime = function(date) {
    return date.toISOString().replace(/-|:|\.\d+/g, '');
  };

  var calculateEndTime = function(event) {
    return event.end ?
      formatTime(event.end) :
      formatTime(new Date(event.start.getTime() + (event.duration * MS_IN_MINUTES)));
  };

  var calendarGenerators = {
    google: function(event, class_name) {
      var startTime = formatTime(event.start);
      var endTime = calculateEndTime(event);

      var href = encodeURI([
        'https://www.google.com/calendar/render',
        '?action=TEMPLATE',
        '&text=' + (event.title || ''),
        '&dates=' + (startTime || ''),
        '/' + (endTime || ''),
        '&details=' + (event.description || ''),
        '&location=' + (event.address || ''),
        '&sprop=&sprop=name:'
      ].join(''));
      return '<a class="'+class_name+'" target="_blank" href="' +
        href + '">Add to Google Calendar</a>';
    },

    yahoo: function(event, class_name) {
      var eventDuration = event.end ?
        ((event.end.getTime() - event.start.getTime())/ MS_IN_MINUTES) :
        event.duration;

      // Yahoo dates are crazy, we need to convert the duration from minutes to hh:mm
      var yahooHourDuration = eventDuration < 600 ?
        '0' + Math.floor((eventDuration / 60)) :
        Math.floor((eventDuration / 60)) + '';

      var yahooMinuteDuration = eventDuration % 60 < 10 ?
        '0' + eventDuration % 60 :
        eventDuration % 60 + '';

      var yahooEventDuration = yahooHourDuration + yahooMinuteDuration;

      // Remove timezone from event time
      var st = formatTime(new Date(event.start - (event.start.getTimezoneOffset() *
                                                  MS_IN_MINUTES))) || '';

      var href = encodeURI([
        'http://calendar.yahoo.com/?v=60&view=d&type=20',
        '&title=' + (event.title || ''),
        '&st=' + st,
        '&dur=' + (yahooEventDuration || ''),
        '&desc=' + (event.description || ''),
        '&in_loc=' + (event.address || '')
      ].join(''));

      return '<a class="'+class_name+'" target="_blank" href="' +
        href + '">Add to Yahoo! Calendar</a>';
    },

    ics: function(event, class_name, calendarName) {
      var startTime = formatTime(event.start);
      var endTime = calculateEndTime(event);

      var href = encodeURI(
        'data:text/calendar;charset=utf8,' + [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'BEGIN:VEVENT',
          'URL:' + document.URL,
          'DTSTART:' + (startTime || ''),
          'DTEND:' + (endTime || ''),
          'SUMMARY:' + (event.title || ''),
          'DESCRIPTION:' + (event.description || ''),
          'LOCATION:' + (event.address || ''),
          'END:VEVENT',
          'END:VCALENDAR'].join('\n'));

      return '<a class="'+class_name+'" target="_blank" href="' +
        href + '">Add to ' + calendarName + ' Calendar</a>';
    },

    ical: function(event, class_name) {
      return this.ics(event, class_name, 'iCal');
    },

    outlook: function(event, class_name) {
      return this.ics(event, class_name, 'Outlook');
    }
  };

  var generateCalendars = function(calendars, event, class_name) {
    var generated_calendar_data = {};
    // loop through all calendars in list and run their respective
    // generator functions
    for( var i=0; i < calendars.length;i++){
      generated_calendar_data[calendars[i]] = calendarGenerators[calendars[i]](event, class_name);
    }
    return generated_calendar_data;
  };

  // Make sure we have the necessary event data, such as start time and event duration
  var validParams = function(params) {
    return params.data !== undefined && params.data.start !== undefined &&
      (params.data.end !== undefined || params.data.duration !== undefined);
  };

  var parseCalendars = function(params) {
    // pass calendar data 
    var parsed_calendars = [];
    if(params.calendars === undefined){
      return valid_calendars;
    }
    for(var i=0; i < params.calendars.length; i++){
      if(!params.calendars[i] in valid_calendars){
        //console.log("skipping invalid calendar", params.calendars[i]);
      }
      parsed_calendars.push(params.calendars[i]);
    }

    return parsed_calendars;
  }

  var generateMarkup = function(calendars, button_text, calendarId) {
    var buttons_wrapper = document.createElement('div');
    buttons_wrapper.id = calendarId;

    Object.keys(calendars).forEach(function(services) {
      buttons_wrapper.innerHTML += calendars[services];
    });

    return buttons_wrapper;
  };

  var getClassName = function(params) {
    if (params.options && params.options.class_name) {
      return params.options.class_name;
    }
  };

  var getButtonText = function(params) {
    if (params.options && params.options.button_text) {
      return params.options.button_text;
    }
  };

  var getOrGenerateCalendarId = function(params) {
    return params.options && params.options.id ?
      params.options.id :
      Math.floor(Math.random() * 1000000); // Generate a 6-digit random ID
  };

  exports.createCalendar = function(params) {
    if (!validParams(params)) {
      //console.log('Event details missing.');
      return false;
    }

    var parsed_calendars = parseCalendars(params);

    if(parsed_calendars.length === 0){
      //console.log('No calendars to be generated');
      return false;
    }

    return generateMarkup(generateCalendars(parsed_calendars, params.data, getClassName(params)),
                          getButtonText(params),
                          getOrGenerateCalendarId(params));
  };
})(this);