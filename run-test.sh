#!/usr/bin/env bash
export GOPATH=$HOME/go
$GOPATH/bin/toml-test -testdir $GOPATH/src/github.com/sgarciac/toml-test/tests ./bombadil-tester.sh
