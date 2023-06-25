#!/bin/bash

for i in {1..1000}
do
  git commit --allow-empty -m "Empty commit $i"
done
