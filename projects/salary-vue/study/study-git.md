# git 常用命令行使用说明

### 一、新建代码库

```
# 在当前目录新建一个Git代码库
$ git init

# 新建一个目录，将其初始化为Git代码库
$ git init [project-name]

# 下载一个项目和它的整个代码历史
$ git clone [url]
```

### 二、配置

```
# 显示当前的Git配置
$ git config --list

# 编辑Git配置文件
$ git config -e [--global]

# 设置提交代码时的用户信息
$ git config [--global] user.name "[name]"
$ git config [--global] user.email "[email address]"
```

### 三、增加/删除文件

```
# 添加指定文件到暂存区
$ git add [file1] [file2] ...

# 添加指定目录到暂存区，包括子目录
$ git add [dir]

# 添加当前目录的所有文件到暂存区
$ git add .

# 添加每个变化前，都会要求确认
# 对于同一个文件的多处变化，可以实现分次提交
$ git add -p

# 删除工作区文件，并且将这次删除放入暂存区
$ git rm [file1] [file2] ...

# 停止追踪指定文件，但该文件会保留在工作区
$ git rm --cached [file]

# 改名文件，并且将这个改名放入暂存区
$ git mv [file-original] [file-renamed]
```

### 四、代码提交

```
# 提交暂存区到仓库区
$ git commit -m [message]

# 提交暂存区的指定文件到仓库区
$ git commit [file1] [file2] ... -m [message]

# 提交工作区自上次commit之后的变化，直接到仓库区
$ git commit -a

# 提交时显示所有diff信息
$ git commit -v

# 使用一次新的commit，替代上一次提交
# 如果代码没有任何新变化，则用来改写上一次commit的提交信息
$ git commit --amend -m [message]

# 重做上一次commit，并包括指定文件的新变化
$ git commit --amend [file1] [file2] ...
```

### 五、分支

```
# 列出所有本地分支
$ git branch

# 列出所有远程分支
$ git branch -r

# 列出所有本地分支和远程分支
$ git branch -a

# 新建一个分支，但依然停留在当前分支
$ git branch [branch-name]

# 新建一个分支，并切换到该分支
$ git checkout -b [branch]

# 新建一个分支，指向指定commit
$ git branch [branch] [commit]

# 新建一个分支，与指定的远程分支建立追踪关系
$ git branch --track [branch] [remote-branch]

# 切换到指定分支，并更新工作区
$ git checkout [branch-name]

# 切换到上一个分支
$ git checkout -

# 建立追踪关系，在现有分支与指定的远程分支之间
$ git branch --set-upstream [branch] [remote-branch]

# 合并指定分支到当前分支
$ git merge [branch]

# 合并分支起冲突后回退到未合并之前
$ git merge --abort

# 选择一个commit，合并进当前分支
$ git cherry-pick [commit]

# 删除已经merge的本地分支
$ git branch -d [branch-name]

# 如果是要删除不管有没有merge的本地分支
$ git branch -D [branch-name]

# 删除远程分支
$ git push origin --delete [branch-name]
$ git branch -dr [remote/branch]
```

### 六、标签

```
# 列出所有tag
$ git tag

# 新建一个tag在当前commit
$ git tag [tag]  (如:git tag v1.5)

# 提交tag到远程
$ git push origin [tag] (如:git push -u origin v1.5)

# 新建一个tag在指定commit
$ git tag [tag] [commit]

# 删除本地tag
$ git tag -d [tag]

# 删除远程tag
$ git push origin :refs/tags/[tagName]

# 查看tag信息
$ git show [tag]

# 提交指定tag
$ git push [remote] [tag]

# 提交所有tag
$ git push [remote] --tags

# 新建一个分支，指向某个tag
$ git checkout -b [branch] [tag]
```

### 七、查看信息

```
# 显示有变更的文件
$ git status

# 显示当前分支的版本历史
$ git log

# 显示commit历史，以及每次commit发生变更的文件
$ git log --stat

# 搜索提交历史，根据关键词
$ git log -S [keyword]

# 显示某个commit之后的所有变动，每个commit占据一行
$ git log [tag] HEAD --pretty=format:%s

# 显示某个commit之后的所有变动，其"提交说明"必须符合搜索条件
$ git log [tag] HEAD --grep feature

# 显示某个文件的版本历史，包括文件改名
$ git log --follow [file]
$ git whatchanged [file]

# 显示指定文件相关的每一次diff
$ git log -p [file]

# 显示过去5次提交
$ git log -5 --pretty --oneline

# 显示所有提交过的用户，按提交次数排序
$ git shortlog -sn

# 显示指定文件是什么人在什么时间修改过
$ git blame [file]

# 显示暂存区和工作区的差异
$ git diff

# 显示暂存区和上一个commit的差异
$ git diff --cached [file]

# 显示工作区与当前分支最新commit之间的差异
$ git diff HEAD

# 显示两次提交之间的差异
$ git diff [first-branch]...[second-branch]

# 显示今天你写了多少行代码
$ git diff --shortstat "@{0 day ago}"

# 显示某次提交的元数据和内容变化
$ git show [commit]

# 显示某次提交发生变化的文件
$ git show --name-only [commit]

# 显示某次提交时，某个文件的内容
$ git show [commit]:[filename]

# 显示当前分支的最近几次提交
$ git reflog
```

### 八、远程同步

git fetch 与 git pull 的区别在于,fetch 只拉取不自动合并,pull 拉取会自动合并代码
所以有的时候你可以 git pull origin test 来在本地分支更新合并远程 test 分支，这样做跟在本地分支 git pull 后再 git merge origin/test 是一样的意思。

```
# 下载远程仓库的所有变动
$ git fetch [remote]

# 显示所有远程仓库
$ git remote -v

# 显示某个远程仓库的信息
$ git remote show [remote]

# 增加一个新的远程仓库，并命名
$ git remote add [shortname] [url]

# 取回远程仓库的变化，并与本地分支合并
$ git pull [remote] [branch]

# 上传本地指定分支到远程仓库(第一次关联)
$ git push -u origin [branch]

# 上传本地指定分支到远程仓库
$ git push [remote] [branch]

# 强行推送当前分支到远程仓库，即使有冲突
$ git push [remote] --force

# 推送所有分支到远程仓库
$ git push [remote] --all
```

### 九、撤销

```
# 恢复暂存区的指定文件到工作区
$ git checkout [file]

# 恢复某个commit的指定文件到暂存区和工作区
$ git checkout [commit] [file]

# 恢复暂存区的所有文件到工作区
$ git checkout .

# 重置暂存区的指定文件，与上一次commit保持一致，但工作区不变
$ git reset [file]

# 重置暂存区与工作区，与上一次commit保持一致
$ git reset --hard

# 重置当前分支的指针为指定commit，同时重置暂存区，但工作区不变
$ git reset [commit]

# 重置当前分支的HEAD为指定commit，同时重置暂存区和工作区，与指定commit一致
$ git reset --hard [commit]

# 重置当前HEAD为指定commit，但保持暂存区和工作区不变
$ git reset --keep [commit]

# 新建一个commit，用来撤销指定commit
# 后者的所有变化都将被前者抵消，并且应用到当前分支
$ git revert [commit]

# 暂时将未提交的变化移除，稍后再移入
$ git stash
$ git stash pop
```

# git commit 之后，想撤销 commit

写完代码后，我们一般这样
git add . //添加所有文件
git commit -m "本功能全部完成"
执行完 commit 后，想撤回 commit，怎么办？
这样凉拌：

```
git reset --soft HEAD^
```

这样就成功的撤销了你的 commit
注意，仅仅是撤回 commit 操作，您写的代码仍然保留。

# 说一下个人理解：

HEAD^的意思是上一个版本，也可以写成 HEAD~1
HEAD^的意思是上一个版本，也可以写成 HEAD~1

# 至于这几个参数：

## --mixed

意思是：不删除工作空间改动代码，撤销 commit，并且撤销 git add . 操作
这个为默认参数,git reset --mixed HEAD^ 和 git reset HEAD^ 效果是一样的。

## --soft

不删除工作空间改动代码，撤销 commit，不撤销 git add .

## --hard

删除工作空间改动代码，撤销 commit，撤销 git add .
注意完成这个操作后，就恢复到了上一次的 commit 状态。

## 顺便说一下，如果 commit 注释写错了，只是想改一下注释，只需要：

```
git commit --amend
```

此时会进入默认 vim 编辑器，修改注释完毕后保存就好了。

# git 自带图形化界面 gitk 即可呼出

当打开 gitk 图形界面时，文件中的中文部分乱码了，这大部分是因为编码格式的问题，为了跟上时代的脚步，本人建议都是用 utf-8 编码。为了方便，我将全局配置为 utf-8 编码。

```
$ gitk
$ git config --global gui.encoding utf-8

```

### 备注一下，window 下忌用自带记事本编辑文档，使用 vim/notepad++,调整编码方式 utf-8 without BOM, 因为在 notepad++中，utf-8 without BOM 才是标准的 utf-8 格式，而在 EditPlus 中，恰恰相反。

# git checkout 切换版本

git checkout commitID 查看指定版本的内容信息
例如 git checkout 2b9d3fg 切换到此 ID（2b9d3fg）的版本

# git 切换到某个 tag

git clone 整个仓库后使用，以下命令就可以取得该 tag 对应的代码了。

```
git checkout tag_name
```

但是，这时候 git 可能会提示你当前处于一个“detached HEAD" 状态。
因为 tag 相当于是一个快照，是不能更改它的代码的。
如果要在 tag 代码的基础上做修改，你需要一个分支：

```
git checkout -b branch_name tag_name
```

这样会从 tag 创建一个分支，然后就和普通的 git 操作一样了。
