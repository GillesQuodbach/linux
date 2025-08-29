if status is-interactive
    # Commands to run in interactive sessions can go here
    function vps
	ssh -i ~/.ssh/id_ed25519 debian@83.228.192.26
    end
    funcsave vps

    function proxy
	ssh -D 1080 -q -C -N debian@83.228.192.26
    end
    funcsave proxy

    function pixel9
	emulator -avd Pixel_9
    end
    funcsave pixel9

    function pixel9-cold
	emulator -avd Pixel_9 -no-snapshot-load
    end
    funcsave pixel9-cold
    
    function vpnup
	sudo wg-quick up wg0
    end
    funcsave vpnup

    function vpndown
	sudo wg-quick down wg0
    end
    funcsave vpndown

end
set -x ANDROID_HOME $HOME/Android/Sdk  # Chemin pour Linux
set -x PATH $PATH $ANDROID_HOME/tools $ANDROID_HOME/platform-tools
set -x PATH $PATH $ANDROID_HOME/tools $ANDROID_HOME/emulator


