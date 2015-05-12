# OuiCal (modification by Damn Fine)

A simple JS library that enables you to add an "add to calendar" button for your upcoming events.

## Inspiration

This project was inspired by [Eventbrite's](http://www.eventbrite.com/) add to calendar feature (which should have been open sourced #justSayin).

Modificiations have been made to remove dependencies on style, creating just the links rather than a single button and dropdown.

## How to use it?

Call 'createCalendar' with your event info, pass in any optional parameters such as a class and/ or id and boom! Insert your add-to-calendar div wherever you'd like.

The only fields that are mandatory are:

  - Event title
  - Start time
  - Event duration, in minutes

## Example

    var myCalendar = createCalendar({
      // optional, you can pass in 'google', 'yahoo', 'outlook', 'ical'
      calendars: ['google'],
      options: {
        class: 'my-class',
        
        // You can pass an ID. If you don't, one will be generated for you
        id: 'my-id'
      },
      data: {
        // Event title
        title: 'Get on the front page of HN',

        // Event start date
        start: new Date('June 15, 2013 19:00'),
        
        // Event duration (IN MINUTES)
        duration: 120,

        // You can also choose to set an end time
        // If an end time is set, this will take precedence over duration
        end: new Date('June 15, 2013 23:00'),     

        // Event Address
        address: 'The internet',

        // Event Description
        description: 'Get on the front page of HN, then prepare for world domination.'
      }
    });

    document.querySelector('#place-where-I-want-this-calendar').appendChild(myCalendar);

## License
[MIT](http://opensource.org/licenses/MIT)
