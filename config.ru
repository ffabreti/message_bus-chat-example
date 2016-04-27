# This file is used by Rack-based servers to start the application.

#require 'message_bus'

require ::File.expand_path('../config/environment',  __FILE__)

    #prepare for passenger
    if defined?(PhusionPassenger)
        # https://www.phusionpassenger.com/library/config/apache/tuning_sse_and_websockets/
        # https://github.com/dimelo/passenger-faye-issue
        PhusionPassenger.advertised_concurrency_level = 0

        # https://github.com/SamSaffron/message_bus
        PhusionPassenger.on_event(:starting_worker_process) do |forked|
            if forked
                # We're in smart spawning mode.
                MessageBus.after_fork
            else
                # We're in conservative spawning mode. We don't need to do anything.
            end
        end
    end

run Rails.application
