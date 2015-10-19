

#!/bin/bash
#  这是一个自动化更新脚本，主要更新工程以及更新主工程所依赖的子项目
cd ..
## 更新所有的子模块
rm -rf ~/content/themes/*

git submodule update --remote --merge --force
##
git push
