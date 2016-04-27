#!/usr/bin/env puma

require 'message_bus'

threads 1,1
workers 1
#preload_app!



on_worker_boot do

  MessageBus.after_fork
  puts '========= ON WORKER BOOT =============='

end
