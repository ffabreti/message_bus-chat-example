#!/usr/bin/env puma

threads 1,20
workers 2
# preload_app!

require 'message_bus'

on_worker_boot do

  MessageBus.after_fork
  Rails.logger.info '========= ON WORKER BOOT =============='

end
