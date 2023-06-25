#!/bin/bash

for i in {1..100}
do
  git commit --allow-empty -m "Empty commit $i"
done
