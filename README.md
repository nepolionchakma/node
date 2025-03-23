########## Welcome To PROCG Server ############

## Add your teammate as a collaborator:

- Go to your repository on GitHub.
- Click on Settings.
- Click on Collaborators and teams.
- Under "Collaborators", enter your teammate's GitHub username and click Add collaborator.
- Your teammate will receive an invitation to access the repository. They need to accept this invitation.

## Clone the repository then work

1.  ### check branch

        git fetch origin

2.  ### switch branch to Nepolion

        git checkout Nepolion

3.  ### Set up the tracking branch (optional but recommended):

        git branch --set-upstream-to=origin/Nepolion Jyanial

4.  ### ON WORK COMPLETE

        git add .
        git commit -m "Your commit message"
        git push origin Nepolion

## Then If any Changes in main

5.  ### Fetch the latest changes from the remote repository

        git fetch origin

6.  ### Switch to your working branch (Nepolion)

        git checkout Nepolion

7.  ### Merge the latest changes from main into Nepolion

        git merge main

8.  ### Resolve any conflicts (if prompted), then add and commit resolved files
9.  ### Open conflicted files, resolve conflicts, and then:

        git add path/to/conflicted-file
        git commit

10. ### Push the merged changes to the remote Nepolion branch
    git push origin Nepolion

# Pull latest changes from both branches:

        git checkout main
        git pull origin main
        git checkout Nepolion
        git pull origin Nepolion

### Switch to main and merge Nepolion Branch:

        git checkout main
        git merge Nepolion

## Resolve conflicts if prompted, then add and commit:

##Open conflicted files, make necessary changes

    git add path/to/conflicted-file
    git commit

##Push merged changes to remote main:

    git push origin main

##Git switch another branch

    git checkout <branch-name>

##Git switch another master

    git checkout master

##You can view the log by using the git log command:

    git log

##If you instead want to keep your changes and continue from here, you can use git switch -c <new-branch-name> to create a new branch from this point.

    git switch -c <new-branch-name>

##fatal: The current branch Nepolion has no upstream branch.
To push the current branch and set the remote as upstream, use

    git push --set-upstream origin Nepolion

##To have this happen automatically for branches without a tracking
upstream, see 'push.autoSetupRemote' in 'git help config'.

    git push --set-upstream origin Nepolion

## Step By Step

##Main Branch
git fetch origin
git pull origin Nepolion

##Branch
git merge main
