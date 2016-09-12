#!/usr/bin/env bash
node-sass ./image-annotation-tool.sass -o ./dist
node-sass ./example -o ./example
tsc