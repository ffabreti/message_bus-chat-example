# see https://github.com/SamSaffron/message_bus/blob/master/examples/chat/chat.rb

require 'message_bus'
#require 'message_bus/backends/postgres'

=begin
MessageBus.configure(
    backend: :redis, url: 'redis://localhost:6379'
    #backend: :postgres,
    # backend_options: {
    #     user: 'messagebus-chat',
    #     password: '123456',
    #     dbname: 'messagebus-chat_development'
    # }
)
=end

$mylock ||= Mutex.new

$online = {
    'joseph' => (Time.now - 280.seconds),
    'donald' => (Time.now - 1.day),
    'hilary' => (Time.now - 2.day),
    'jeffey' => (Time.now - 290.seconds)
}


MessageBus.subscribe "/presence" do |msg|

    #$mylock.synchronize {

        if user = msg.data["enter"]
            $online[user] = Time.now
            puts "/PRESENCE ENTER: #{user}"
        end
        if user = msg.data["leave"]
            if $online[user]
                puts "/PRESENCE LEAVE: #{user}"
                $online.delete user
                #puts caller(0)
            end

        end

    #}

end

MessageBus.user_id_lookup do |env|

    MessageBus.logger = env['rack.logger']
    name = env["HTTP_X_USERNAME"]
    if name
        unless $online[name]
            # we have received a pooling from a client that is not on our online hash
            # let's tell everyone it's online...
            #MessageBus.publish "/presence", {enter: name}
        end
        # ... and register it as online
        $online[name] = Time.now
    end
    name

end

def expire_old_sessions
    #$mylock.synchronize {
        $online.each do |name, time|
            if (Time.now - (5*60)) > time
                puts "SESSION EXPIRED FOR [#{name}] - #{time}"
                MessageBus.publish "/presence", {leave: name}
            end
        end
    #}
rescue => e
    # need to make $online thread safe
    p e

end

Thread.new do

    sleep 5

    while true
        expire_old_sessions
        sleep 2
    end

end