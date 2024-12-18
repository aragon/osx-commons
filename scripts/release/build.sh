#!/usr/bin/env bash

set -euo pipefail

package="${REF_NAME##*-}"

cd $package

yarn build

cd ..