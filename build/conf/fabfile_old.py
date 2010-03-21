def production():
    "Set the variables for the production environment"
    set(fab_hosts=["67.23.4.212"])
    set(fab_user="taylan")
    set(remote_dir="/home/taylan/sites/fsandassociates")


def deploy(hash="HEAD"):
    "Deploy the static site by packaging a specific hash or tag from the git repo"
    # Make sure that the required variables are here
    require("fab_hosts", provided_by=[production])
    require("fab_user", provided_by=[production])
    require("remote_dir", provided_by=[production])
    
    # Set the commit hash (HEAD if not given)
    set(hash=hash)
    
    # Create a temporary local directory, export the given commit using git archive
    local("mkdir ../../tmp")
    local("cd ../../; git archive --format=tar --prefix=deploy/ $(hash) build/static | gzip > tmp/archive.tar.gz")
    
    # Upload the archive to the server
    put("../../tmp/archive.tar.gz", "$(remote_dir)/archive.tar.gz")
    
    # Extract the files from the archive, remove the file
    run("cd $(remote_dir); tar -xzf archive.tar.gz; rm -f archive.tar.gz")
    
    # Deploy the new version
    run("rm -rf $(remote_dir)/live")
    run("mv $(remote_dir)/deploy/build/static $(remote_dir)/live")
    run("rm -rf $(remote_dir)/deploy")

    # Remove the temporary local directory
    local("rm -rf ../../tmp")
