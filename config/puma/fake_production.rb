#!/usr/bin/env puma

#require 'message_bus'

threads 1,1
workers 1          #Comment this to avoid on_worker_boot
#preload_app!

#MessageBus.after_fork


on_worker_boot do

  MessageBus.after_fork   #Comment this to stop receiving double messages from subscribe callback

  puts '========= ON WORKER BOOT =============='

end
