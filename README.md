# message_bus-chat-example
Rails 4.1 + Postgresql 9 + Puma + message_bus 2.0.0.beta

MessageBus Repo: https://github.com/SamSaffron/message_bus

## How to use


### 1) Download from one branch:

>In the master branch,    you find the Jquery version:

`$ git clone -b master    https://github.com/ffabreti/message_bus-chat-example.git`

> In the angularJS branch, you will find the AngularJS version.
MessageBus Jquery client was converted to AngularJS.
There is no Jquery dependency. You can find [a initial diff here](https://github.com/ffabreti/message_bus-chat-example/commit/2cf8a138cdf572868ec64b908ca6d95b127ae774).


`git clone -b angularJS https://github.com/ffabreti/message_bus-chat-example.git`

### 2) Bundle it
`$ bundle install`

### 3) Migrate it
`$ rake db:migrate`

### 4) Run Rails Server
> You may want to run the fake_production environment so that you get thread safe, puma threads, concurrency, etc

`$ rails server -e fake_production` or `$ passenger start -e fake_production`

### 5) Run Clients
Open up 2 different browsers and point then to `http://localhost:3000`

