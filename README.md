# Vayu [![Code Climate](https://codeclimate.com/github/maheshj567/vayu.png)](https://codeclimate.com/github/maheshj567/vayu) [![Dependency status](https://gemnasium.com/maheshj567/vayu.png)](https://gemnasium.com/maheshj567/vayu) [![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/maheshj567/vayu/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

It started off a project to help myself understand Backbone.js. Now I'm working on making it into a full featured app. The roadmap is a little fuzzy right now. I'm just adding whatever features that are on my mind.

Got any ideas? Or just say hi? Get in touch [@maheshj567](http://twitter.com/maheshj567).

[Try out the app](http://vayu.io)

## Current feature set

1. Create boards
2. Edit board names
3. Create cards
4. Edit cards
5. Create/finish todo's
6. Facebook login
7. Uses MongoDB for storing data

## Technical details

1. **HTML5** localstorage APIs (not using from v0.4)
2. **Backbone.js** for app logic
3. **Zurb Foundation** framework for UI
4. **Express (Node.js)** added as server side framework (using just to serve static assets right now)
5. **MongoDB** for storing data
6. **Redis** for session store

### Roadmap
1. Edit/delete todos
2. Delete/archive boards and cards
3. Better design of the app
4. Search

## License

Apache License, Version 2.0

## Progress

### v0.4

* Upgraded to Foundation 5
* MongoDB backend
* Redis for session management
* FB login integration
* Server side integration
* Finished on 14 Feb, '14'

### v0.3

* Changed name and hosting
* Changed logo
* added a lot of details to README
* Finished on 12 Dec, '13

### v0.2

* using JSON.stringify to encode data instead of manually building the string - fixes bugs related to JSON encoding
* edit board and card name
* Finished on 23 Nov, '13

### v0.1

* Cards are added to the list at the top (rather) than at the bottom
* Used require.js to create a modular application structure - separate views and models

### v0

* Add boards
* Add cards
* Add todo's
* Reset everything
* Store data in LocalStorage
* Finished on 07 Oct, '12