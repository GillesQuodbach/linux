if status is-interactive
    # Commands to run in interactive sessions can go here
    function vps
	ssh -i ~/.ssh/id_rsa ubuntu@83.228.192.26
    end
    funcsave vps
end

set -gx TERMINAL kitty
