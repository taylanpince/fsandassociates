from __future__ import with_statement

from fabric.api import *
from fabric.contrib.console import confirm


env.remote_dir = "/home/taylan/sites/fsandassociates"
env.hosts = [
    "67.23.4.212",
]


def pack(hash="HEAD"):
    # Create a temporary local directory, export the given commit using git archive
    local("mkdir ../../tmp", capture=False)
    local("cd ../../ && git archive --format=tar --prefix=deploy/ %s conf build/static build/conf | gzip > tmp/archive.tar.gz" % hash, capture=False)


def clean():
    # Remove the temporary local directory
    local("rm -rf ../../tmp", capture=False)


def deploy_live():
    pack()
    deploy("live")
    clean()


def deploy_preview():
    pack()
    deploy("preview")
    clean()


def deploy(environment):
    # Upload the archive to the server
    put("../../tmp/archive.tar.gz", "%(remote_dir)s/archive.tar.gz" % env)
    
    with cd(env.remote_dir):
        # Extract the files from the archive, remove the file
        run("tar -xzf archive.tar.gz")
        run("rm -f archive.tar.gz")
        
        # Remove conf dir
        run("rm -rf conf")
        
        # Move directories out of the build folder and get rid of it
        run("mv deploy/build/* ./")
        run("rm -rf deploy")
        
        # Remove the active version of the app and move the new one in its place
        run("rm -rf %s" % environment)
        run("mv static %s" % environment)
    
    # Restart nginx
    sudo("/etc/init.d/nginx restart")
