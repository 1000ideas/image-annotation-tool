#!/usr/bin/env bash

run_sass_editor() {
    echo 'running lib node-sass...' 
    exec node-sass -w ./image-annotation-tool.sass -o ./dist
}

run_sass_example() {
    echo 'running examples node-sass...'
    exec node-sass -w ./example -o ./example
}

run_server() {
    echo 'running server...'
    exec php -S 127.0.0.1:8080
}

run_sass_editor & run_sass_example & run_server
