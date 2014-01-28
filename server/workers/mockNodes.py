#!/usr/bin/python

import json, os, commands, binascii, string, random, errno, sys

def genUUID():
    return commands.getoutput("uuidgen").upper() + "-" + binascii.b2a_hex(os.urandom(6)).upper()

def genMAC():
    return binascii.b2a_hex(os.urandom(1)).upper() + ":" + binascii.b2a_hex(os.urandom(1)).upper() + ":" + binascii.b2a_hex(os.urandom(1)).upper() + ":" + binascii.b2a_hex(os.urandom(1)).upper() + ":" + binascii.b2a_hex(os.urandom(1)).upper() + ":" + binascii.b2a_hex(os.urandom(1)).upper()

def genIP():
    #return str(random.randrange(0,255)) + "." + str(random.randrange(0,255)) + "." + str(random.randrange(0,255)) + "." + str(random.randrange(0,255))
    return "10." + str(random.randrange(0,255)) + "." + str(random.randrange(0,255)) + "." + str(random.randrange(0,255))

def genIPs():
    return [genIP() for x in range(random.randint(1,25))]

def genTime():
    return int(commands.getoutput('date "+%s"')) + random.randint(0,5000)

def genPackages():
    packageList = ["basesystem-10.0-4.el6.noarch", "elfutils-0.152-1.el6.x86_64", "freeipmi-1.3.1-1.el6.x86_64", "OpenIPMI-2.0.16-14.el6.x86_64", "info-4.13a-8.el6.x86_64", "libee-0.4.1-1.el6.x86_64", "libgcc-4.4.7-4.el6.x86_64", "gamin-0.1.10-9.el6.x86_64", "glibc-2.12-1.132.el6.x86_64", "bzip2-libs-1.0.5-7.el6_0.x86_64", "db4-4.7.25-18.el6_4.x86_64", "sqlite-3.6.20-1.el6.x86_64", "perl-Pod-Escapes-1.04-136.el6.x86_64", "dbus-libs-1.2.24-7.el6_3.x86_64", "perl-version-0.77-136.el6.x86_64", "lua-5.1.4-4.1.el6.x86_64", "coreutils-libs-8.4-31.el6.x86_64", "xz-libs-4.999.9-0.3.beta.20091007git.el6.x86_64", "libuuid-2.17.2-12.14.el6.x86_64", "findutils-4.4.2-6.el6.x86_64", "gzip-1.3.12-19.el6_4.x86_64", "which-2.19-6.el6.x86_64", "libstdc++-4.4.7-4.el6.x86_64", "sysvinit-tools-2.87-5.dsf.el6.x86_64", "file-5.04-15.el6.x86_64", "python-2.6.6-51.el6.x86_64", "libusb-0.1.12-23.el6.x86_64", "dbus-glib-0.86-6.el6.x86_64", "net-tools-1.60-110.el6_2.x86_64", "openldap-2.4.23-32.el6_4.1.x86_64", "logrotate-3.7.8-17.el6.x86_64", "binutils-2.20.51.0.2-5.36.el6.x86_64", "rpm-libs-4.8.0-37.el6.x86_64", "dash-0.5.5.1-4.el6.x86_64", "upstart-0.6.5-12.el6_4.1.x86_64", "setup-2.8.14-20.el6_4.1.noarch", "glibc-devel-2.12-1.132.el6.x86_64", "redhat-logos-60.0.14-12.el6.centos.noarch", "iputils-20071127-17.el6_4.2.x86_64", "policycoreutils-2.0.83-19.39.el6.x86_64", "openssh-5.3p1-94.el6.x86_64", "keyutils-libs-1.4-4.el6.x86_64", "device-mapper-event-1.02.79-8.el6.x86_64", "plymouth-core-libs-0.8.3-27.el6.centos.x86_64", "selinux-policy-3.7.19-231.el6.noarch", "newt-0.52.11-3.el6.x86_64", "ntp-4.2.6p5-1.el6.centos.x86_64", "lvm2-2.02.100-8.el6.x86_64", "mdadm-3.2.6-7.el6.x86_64", "dhclient-4.1.1-38.P1.el6.centos.x86_64", "rpm-python-4.8.0-37.el6.x86_64", "python-iniparse-0.3.1-2.1.el6.noarch", "gnupg2-2.0.14-6.el6_4.x86_64", "newt-python-0.52.11-3.el6.x86_64", "python-urlgrabber-3.9.1-9.el6.noarch", "lshw-2.17-1.el6.rf.x86_64", "efibootmgr-0.5.4-11.el6.x86_64", "libselinux-python-2.0.94-5.3.el6_4.1.x86_64", "perl-Net-SSLeay-1.35-9.el6.x86_64", "openssl-1.0.1e-16.el6_5.1.x86_64", "cyrus-sasl-2.1.23-13.el6_3.1.x86_64", "screen-4.0.3-16.el6.x86_64", "crontabs-1.10-33.el6.noarch", "libproxy-bin-0.3.0-4.el6_3.x86_64", "kbd-1.15-11.el6.x86_64", "avahi-libs-0.6.25-12.el6.x86_64", "fuse-2.8.3-4.el6.x86_64", "perl-IO-Compress-Base-2.021-136.el6.x86_64", "cryptsetup-luks-1.2.0-7.el6.x86_64", "autoconf-2.63-5.1.el6.noarch", "perl-Error-0.17015-4.el6.noarch", "authconfig-6.1.12-13.el6.x86_64", "libSM-1.2.1-2.el6.x86_64", "alsa-lib-1.0.22-3.el6.x86_64", "acl-2.2.49-6.el6.x86_64", "gettext-0.17-16.el6.x86_64", "gpg-pubkey-c105b9de-4e0fd3a3", "git-1.7.1-3.el6_4.1.x86_64", "kernel-devel-2.6.32-431.1.2.0.1.el6.x86_64", "python-dmidecode-3.10.13-3.el6_4.x86_64", "libxcb-1.8.1-1.el6.x86_64", "perl-XML-Parser-2.36-7.el6.x86_64", "python-simplejson-2.0.9-3.1.el6.x86_64", "libXrender-0.9.7-2.el6.x86_64", "ConsoleKit-libs-0.4.1-3.el6.x86_64", "libXi-1.6.1-3.el6.x86_64", "libXcursor-1.1.13-6.20130524git8f677eaea.el6.x86_64", "dbus-python-0.83.0-6.1.el6.x86_64", "libXcomposite-0.4.3-4.el6.x86_64", "xz-lzma-compat-4.999.9-0.3.beta.20091007git.el6.x86_64", "gettext-devel-0.17-16.el6.x86_64", "intltool-0.41.0-1.1.el6.noarch", "libtool-2.2.6-15.5.el6.x86_64", "bison-2.4.1-5.el6.x86_64", "rcs-5.7-37.el6.x86_64", "file-devel-5.04-15.el6.x86_64", "cscope-15.6-6.el6.x86_64", "mercurial-1.4-3.el6.x86_64", "filesystem-2.4.30-3.el6.x86_64", "tcpdump-4.0.0-3.20090921gitdf3cb4.2.el6.x86_64", "patch-2.6-6.el6.x86_64", "ncurses-base-5.7-3.20090208.el6.x86_64", "usbutils-003-4.el6.x86_64", "elfutils-libs-0.152-1.el6.x86_64", "unzip-6.0-1.el6.x86_64", "texinfo-4.13a-8.el6.x86_64", "ncurses-libs-5.7-3.20090208.el6.x86_64", "lm_sensors-libs-3.1.1-17.el6.x86_64", "libattr-2.4.44-7.el6.x86_64", "OpenIPMI-libs-2.0.16-14.el6.x86_64", "zlib-1.2.3-29.el6.x86_64", "python-setuptools-0.6.10-3.el6.noarch", "popt-1.13-7.el6.x86_64", "audit-libs-2.2-2.el6.x86_64", "libmongo-client-0.1.6.1-1.el6.x86_64", "libacl-2.2.49-6.el6.x86_64", "json-c-0.10-2.el6.x86_64", "readline-6.0-4.el6.x86_64", "bash-4.1.2-15.el6_4.x86_64", "shadow-utils-4.1.4.2-13.el6.x86_64", "nss-softokn-freebl-3.14.3-9.el6.x86_64", "chkconfig-1.3.49.3-2.el6_4.1.x86_64", "nspr-4.10.2-1.el6_5.x86_64", "gawk-3.1.7-10.el6.x86_64", "nss-util-3.15.3-1.el6_5.x86_64", "libgpg-error-1.7-4.el6.x86_64", "perl-Pod-Simple-3.13-136.el6.x86_64", "perl-Module-Pluggable-3.90-136.el6.x86_64", "perl-5.10.1-136.el6.x86_64", "cyrus-sasl-lib-2.1.23-13.el6_3.1.x86_64", "grep-2.6.3-4.el6.x86_64", "expat-2.0.1-11.el6_2.x86_64", "coreutils-8.4-31.el6.x86_64", "elfutils-libelf-0.152-1.el6.x86_64", "module-init-tools-3.9-21.el6_4.x86_64", "bzip2-1.0.5-7.el6_0.x86_64", "libblkid-2.17.2-12.14.el6.x86_64", "libgcrypt-1.4.5-11.el6_4.x86_64", "cpio-2.10-11.el6_3.x86_64", "nss-softokn-3.14.3-9.el6.x86_64", "pth-2.0.7-9.3.el6.x86_64", "libxml2-2.7.6-14.el6.x86_64", "p11-kit-0.18.5-2.el6.x86_64", "p11-kit-trust-0.18.5-2.el6.x86_64", "gmp-4.3.1-7.el6_2.2.x86_64", "python-libs-2.6.6-51.el6.x86_64", "MAKEDEV-3.24-6.el6.x86_64", "shared-mime-info-0.70-4.el6.x86_64", "psmisc-22.6-15.el6_0.1.x86_64", "grubby-7.0.15-5.el6.x86_64", "vim-minimal-7.2.411-1.8.el6.x86_64", "procps-3.2.8-25.el6.x86_64", "libcurl-7.19.7-37.el6_4.x86_64", "hwdata-0.233-9.1.el6.noarch", "pinentry-0.7.6-6.el6.x86_64", "libss-1.41.12-18.el6.x86_64", "m4-1.4.13-5.el6.x86_64", "db4-utils-4.7.25-18.el6_4.x86_64", "rpm-4.8.0-37.el6.x86_64", "ncurses-5.7-3.20090208.el6.x86_64", "libestr-0.1.9-1.el6.x86_64", "less-436-10.el6.x86_64", "cpp-4.4.7-4.el6.x86_64", "dhcp-common-4.1.1-38.P1.el6.centos.x86_64", "cracklib-dicts-2.8.16-4.el6.x86_64", "kernel-firmware-2.6.32-431.1.2.0.1.el6.noarch", "glibc-headers-2.12-1.132.el6.x86_64", "centos-release-6-5.el6.centos.11.2.x86_64", "plymouth-scripts-0.8.3-27.el6.centos.x86_64", "iproute-2.6.32-31.el6.x86_64", "util-linux-ng-2.17.2-12.14.el6.x86_64", "udev-147-2.51.el6.x86_64", "libuser-0.56.13-5.el6.x86_64", "device-mapper-libs-1.02.79-8.el6.x86_64", "libedit-2.11-4.20080712cvs.1.el6.x86_64", "device-mapper-event-libs-1.02.79-8.el6.x86_64", "mingetty-1.08-5.el6.x86_64", "rsyslog-7.4.7-1.el6.x86_64", "cronie-1.4.4-12.el6.x86_64", "pciutils-libs-3.1.10-2.el6.x86_64", "lvm2-libs-2.02.100-8.el6.x86_64", "libcap-ng-0.6.4-3.el6_0.1.x86_64", "device-mapper-multipath-libs-0.4.9-72.el6.x86_64", "slang-2.2.1-1.el6.x86_64", "dracut-004-336.el6_5.2.noarch", "ustr-1.0.4-9.1.el6.x86_64", "ntpdate-4.2.6p5-1.el6.centos.x86_64", "libaio-0.3.107-10.el6.x86_64", "kernel-2.6.32-431.1.2.0.1.el6.x86_64", "device-mapper-multipath-0.4.9-72.el6.x86_64", "rsyslog-mmjsonparse-7.4.7-1.el6.x86_64", "libssh2-1.4.2-1.el6.x86_64", "openssh-server-5.3p1-94.el6.x86_64", "python-pycurl-7.19.0-8.el6.x86_64", "libdrm-2.4.45-2.el6.x86_64", "iscsi-initiator-utils-6.2.0.873-10.el6.x86_64", "pygpgme-0.1-18.20090824bzr68.el6.x86_64", "iptables-ipv6-1.4.7-11.el6.x86_64", "rpm-devel-4.8.0-37.el6.x86_64", "yum-metadata-parser-1.1.2-16.el6.x86_64", "fipscheck-lib-1.2.0-7.el6.x86_64", "openvpn-as-2.0.2-CentOS6.4.x86_64", "denyhosts-2.6-19.el6.noarch", "dhcp-4.1.1-38.P1.el6.centos.x86_64", "nss-sysinit-3.15.3-3.el6_5.x86_64", "ca-certificates-2013.1.95-65.1.el6_5.noarch", "nss-tools-3.15.3-3.el6_5.x86_64", "postfix-2.6.6-2.2.el6_1.x86_64", "yum-3.2.29-43.el6.centos.noarch", "freetype-2.3.11-14.el6_3.1.x86_64", "libjpeg-turbo-1.2.1-3.el6_5.x86_64", "kbd-misc-1.15-11.el6.noarch", "libproxy-python-0.3.0-4.el6_3.x86_64", "perl-URI-1.40-2.el6.noarch", "kernel-2.6.32-358.el6.x86_64", "libpng-1.2.49-1.el6_2.x86_64", "apr-1.3.9-5.el6_2.x86_64", "libICE-1.0.6-1.el6.x86_64", "atk-1.30.0-1.el6.x86_64", "automake-1.11.1-4.el6.noarch", "b43-openfwwf-5.2-4.el6.noarch", "perl-Compress-Raw-Zlib-2.021-136.el6.x86_64", "perl-IO-Compress-Zlib-2.021-136.el6.x86_64", "cups-libs-1.4.2-50.el6_4.5.x86_64", "passwd-0.77-4.el6_2.2.x86_64", "apr-util-1.3.9-3.el6_0.1.x86_64", "audit-2.2-2.el6.x86_64", "libthai-0.1.12-3.el6.x86_64", "pixman-0.26.2-5.1.el6_5.x86_64", "attr-2.4.44-7.el6.x86_64", "cvs-1.11.23-16.el6.x86_64", "rootfiles-8.1-6.1.el6.noarch", "systemtap-runtime-2.3-4.el6_5.x86_64", "perl-Git-1.7.1-3.el6_4.1.noarch", "gpg-pubkey-0608b895-4bd22942", "libgfortran-4.4.7-4.el6.x86_64", "dmidecode-2.11-2.el6.x86_64", "libart_lgpl-2.3.20-5.1.el6.x86_64", "systemtap-devel-2.3-4.el6_5.x86_64", "pciutils-3.1.10-2.el6.x86_64", "libXau-1.0.6-4.el6.x86_64", "hpacucli-9.40-12.0.x86_64", "perl-HTML-Tagset-3.20-4.el6.noarch", "perl-libwww-perl-5.833-2.el6.noarch", "pyOpenSSL-0.10-2.el6.x86_64", "gettext-libs-0.17-16.el6.x86_64", "python-paste-1.7.4-2.el6.noarch", "libX11-1.5.0-4.el6.x86_64", "hal-libs-0.5.14-11.el6.x86_64", "libXext-1.3.1-2.el6.x86_64", "eggdbus-0.6-3.el6.x86_64", "libXfixes-5.0-3.el6.x86_64", "libXrandr-1.4.0-1.el6.x86_64", "hal-info-20090716-3.1.el6.noarch", "libXdamage-1.1.3-4.el6.x86_64", "hal-0.5.14-11.el6.x86_64", "libXinerama-1.1.2-2.el6.x86_64", "smolt-1.4.2.2-8.el6.noarch", "pango-1.28.1-7.el6_3.x86_64", "xz-4.999.9-0.3.beta.20091007git.el6.x86_64", "hicolor-icon-theme-0.11-1.1.el6.noarch", "man-1.6f-32.el6.x86_64", "libgcj-4.4.7-4.el6.x86_64", "gpg-pubkey-6b8d79e6-3f49313d", "pakchois-0.4-3.2.el6.x86_64", "subversion-1.6.11-9.el6_4.x86_64", "systemtap-2.3-4.el6_5.x86_64", "ppl-0.10.2-11.el6.x86_64", "gcc-c++-4.4.7-4.el6.x86_64", "byacc-1.9.20070509-7.el6.x86_64", "indent-2.2.10-7.el6.x86_64", "libgpg-error-devel-1.7-4.el6.x86_64", "flex-2.5.35-8.el6.x86_64", "make-3.81-20.el6.x86_64", "redhat-rpm-config-9.0.3-42.el6.centos.noarch", "popt-devel-1.13-7.el6.x86_64", "ctags-5.8-2.el6.x86_64", "patchutils-0.3.1-3.1.el6.x86_64", "rpm-build-4.8.0-37.el6.x86_64", "e2fsprogs-1.41.12-18.el6.x86_64", "sudo-1.8.6p3-12.el6.x86_64", "libxml2-python-2.7.6-14.el6.x86_64", "grub-0.97-83.el6.x86_64", "ipmitool-1.8.11-16.el6.x86_64", "libgcrypt-devel-1.4.5-11.el6_4.x86_64", "hdparm-9.43-4.el6.x86_64", "rpmforge-release-0.5.3-1.el6.rf.x86_64", "pam-devel-1.1.1-17.el6.x86_64", "libusb1-1.0.9-0.6.rc1.el6.x86_64", "gdb-7.2-60.el6_4.1.x86_64", "libcap-2.16-5.5.el6.x86_64", "python-pip-1.3.1-4.el6.noarch", "libgt-0.3.11-1.el6.x86_64", "libsepol-2.0.41-4.el6.x86_64", "glibc-common-2.12-1.132.el6.x86_64", "sed-4.2.1-10.el6.x86_64", "libselinux-2.0.94-5.3.el6_4.1.x86_64", "libcom_err-1.41.12-18.el6.x86_64", "file-libs-5.04-15.el6.x86_64", "perl-libs-5.10.1-136.el6.x86_64", "pcre-7.8-6.el6.x86_64", "krb5-libs-1.10.3-10.el6_4.6.x86_64", "libidn-1.18-2.el6.x86_64", "pam-1.1.1-17.el6.x86_64", "libudev-147-2.51.el6.x86_64", "checkpolicy-2.0.22-1.el6.x86_64", "tcp_wrappers-libs-7.6-57.el6.x86_64", "libtasn1-2.3-3.el6_2.1.x86_64", "libnih-1.0.1-7.el6.x86_64", "glib2-2.26.1-3.el6.x86_64", "libutempter-1.1.5-4.1.el6.x86_64", "device-mapper-persistent-data-0.2.8-2.el6.x86_64", "tar-1.23-11.el6.x86_64", "curl-7.19.7-37.el6_4.x86_64", "e2fsprogs-libs-1.41.12-18.el6.x86_64", "diffutils-2.8.1-28.el6.x86_64", "libselinux-utils-2.0.94-5.3.el6_4.1.x86_64", "groff-1.18.1.4-21.el6.x86_64", "libgomp-4.4.7-4.el6.x86_64", "cracklib-2.8.16-4.el6.x86_64", "kernel-headers-2.6.32-431.1.2.0.1.el6.x86_64", "iptables-1.4.7-11.el6.x86_64", "libpciaccess-0.13.1-2.el6.x86_64", "initscripts-9.03.40-2.el6.centos.x86_64", "device-mapper-1.02.79-8.el6.x86_64", "gdbm-1.8.0-36.el6.x86_64", "cronie-anacron-1.4.4-12.el6.x86_64", "ethtool-3.5-1.el6.x86_64", "kpartx-0.4.9-72.el6.x86_64", "libffi-3.0.5-3.2.el6.x86_64", "dracut-kernel-004-336.el6_5.2.noarch", "libsemanage-2.0.43-4.2.el6.x86_64", "selinux-policy-targeted-3.7.19-231.el6.noarch", "openssh-clients-5.3p1-94.el6.x86_64", "haproxy-1.4.24-2.el6.x86_64", "gpgme-1.1.8-3.el6.x86_64", "gcc-4.4.7-4.el6.x86_64", "net-snmp-libs-5.5-49.el6.x86_64", "yum-plugin-fastestmirror-1.1.30-14.el6.noarch", "polkit-0.96-5.el6_4.x86_64", "fipscheck-1.2.0-7.el6.x86_64", "mysql-libs-5.1.71-1.el6.x86_64", "xfsprogs-3.1.1-14.el6.x86_64", "webmin-1.660-1.noarch", "portreserve-0.0.4-9.el6.x86_64", "cryptsetup-luks-libs-1.2.0-7.el6.x86_64", "nss-3.15.3-3.el6_5.x86_64", "plymouth-0.8.3-27.el6.centos.x86_64", "tzdata-2013i-1.el6.noarch", "fontconfig-2.8.0-3.el6.x86_64", "libproxy-0.3.0-4.el6_3.x86_64", "libtiff-3.9.4-9.el6_3.x86_64", "system-config-firewall-base-1.2.27-5.el6.noarch", "gnutls-2.8.5-10.el6_4.2.x86_64", "zip-3.0-1.el6.x86_64", "perl-Compress-Zlib-2.021-136.el6.x86_64", "jasper-libs-1.900.1-15.el6_1.1.x86_64", "libstdc++-devel-4.4.7-4.el6.x86_64", "bridge-utils-1.2-10.el6.x86_64", "rsync-3.0.6-9.el6_4.1.x86_64", "epel-release-6-8.noarch", "mailcap-2.1.31-2.el6.noarch", "systemtap-client-2.3-4.el6_5.x86_64", "wget-1.12-1.8.el6.x86_64", "perl-HTML-Parser-3.64-2.el6.x86_64", "dbus-1.2.24-7.el6_3.x86_64", "libX11-common-1.5.0-4.el6.noarch", "certmaster-0.28-1.el6.noarch", "cairo-1.8.8-3.1.el6.x86_64", "ConsoleKit-0.4.1-3.el6.x86_64", "libXtst-1.2.1-2.el6.x86_64", "pm-utils-1.2.5-10.el6.x86_64", "libXft-2.3.1-2.el6.x86_64", "func-0.28-1.el6.noarch", "gtk2-2.20.1-4.el6.x86_64", "neon-0.29.3-3.el6_4.x86_64", "mpfr-2.4.1-6.el6.x86_64", "gcc-gfortran-4.4.7-4.el6.x86_64", "cloog-ppl-0.15.7-1.2.el6.x86_64", "doxygen-1.6.1-6.el6.x86_64", "swig-1.3.40-6.el6.x86_64", "pkgconfig-0.23-9.1.el6.x86_64", "diffstat-1.51-2.el6.x86_64"]
    sampleSize = random.randint(25,len(packageList))
    randIndex = random.sample(range(len(packageList)), sampleSize)
    randIndex.sort()
    return [packageList[i] for i in randIndex]

def genEmptyDIMM(location):
    dimm = {}
    dimm["bank"] = "Not Specified"
    dimm["locator"] = "DIMM" + str(location)
    dimm["platform"] = "Not Specified"
    dimm["serial"] = "Not Specified"
    dimm["size"] = 0
    dimm["speed"] = "(ns)"
    dimm["units"] = ""
    dimm["vendor"] = "Not Specified"
    return dimm

def genDIMM(location, vendor):
    dimm = {}
    dimm["bank"] = "Not Specified"
    dimm["locator"] = "DIMM" + str(location)
    dimm["platform"] = "Not Specified"
    dimm["serial"] = "Not Specified"
    dimm["size"] = 4096
    dimm["speed"] = "1333 MHz (0.8ns)"
    dimm["units"] = "MB"
    dimm["vendor"] = vendor
    return dimm

def genMemory(memTotal):
    #Generate a dictionary with x number of slots and a random popultaiton of DIMMS
    vendor = random.choice(["Kingston", "Hynix", "Hyundai", "Corsair", "Wintec"])
    dimms = [dict() for x in range(12)]
    for i in range(len(dimms)):
        if i < (memTotal / 4):
            dimms[i] = genDIMM(i, vendor)
        else:
            dimms[i] = genEmptyDIMM(i)
    return dimms

def genBMC(vendor):
    #Genrate a BMC dictionary
    bmc = {}
    bmc["ipmi"] = "2.0" 
    bmc["vendor"] = vendor
    return bmc

def genBIOS(vendor):
    #Genreate a BIOS dictionary
    bios = {}
    bios["firmware"] = str(random.randint(0,12)) + "." + str(random.randint(0,45))
    bios["vendor"] = vendor
    return bios

def genOS():
    #Generate a OS dictionary
    #dist0, dist1, dist3, platform, release, version
    OS = random.choice([["Ubuntu", "13.10", "Suacy", "Linux-3.11.0-15-generic-x86_64-with-Ubuntu-13.10-saucy", "3.11.0-15-generic-x86_64", "#23-Ubuntu SMP Mon Dec 9 18:17:04 UTC 2013"], ["Ubuntu", "13.04", "Raring", "Linux-3.04.0-15-generic-x86_64-with-Ubuntu-13.04-raring", "3.04.0-generic-x86_64", "#21-Ubuntu SMP Mon Sep 26 21:33:23 UTC 2013"], ["Ubuntu", "12.10", "Quantal", "Linux-3.11.0-15-generic-x86_64-with-Ubuntu-12.10-quantal", "3.11.0-12-generic-x86_64", "#12-Ubuntu SMP Sep 26 21:33:43 UTC 2013"], ["Ubuntu", "12.04", "Precise", "Linux-3.11.0-15-generic-x86_64-with-Ubuntu-12.04-precise", "3.11.0-11-generic-x86_64", "#9-Ubuntu SMP Sep 26 18:17:04 UTC 2013"], ["Ubuntu", "10.04", "Lucid", "Linux-3.11.0-15-generic-x86_64-with-Ubuntu-10.04-lucid", "3.01.0-generic-x86_64", "#3-Ubuntu SMP Mon Dec 9 18:17:04 UTC 2013"], ["centos", "6.0", "Final", "Linux-2.6.32-431.1.2.0.1.el6.x86_64-x86_64-with-centos-6.0-Final", "2.6.32-431.1.2.0.1.el6.x86_644", "#1 SMP Fri Dec 13 13:06:13 UTC 2013"], ["centos", "6.1", "Final", "Linux-2.6.32-431.1.2.0.1.el6.x86_64-x86_64-with-centos-6.1-Final", "2.6.32-431.1.2.0.1.el6.x86_644", "#1 SMP Fri Dec 13 13:06:13 UTC 2013"], ["centos", "6.2", "Final", "Linux-2.6.32-431.1.2.0.1.el6.x86_64-x86_64-with-centos-6.2-Final", "2.6.32-431.1.2.0.1.el6.x86_644", "#1 SMP Fri Dec 13 13:06:13 UTC 2013"], ["centos", "6.3", "Final", "Linux-2.6.32-431.1.2.0.1.el6.x86_64-x86_64-with-centos-6.3-Final", "2.6.32-431.1.2.0.1.el6.x86_644", "#1 SMP Fri Dec 13 13:06:13 UTC 2013"], ["centos", "6.4", "Final", "Linux-2.6.32-431.1.2.0.1.el6.x86_64-x86_64-with-centos-6.4-Final", "2.6.32-431.1.2.0.1.el6.x86_644", "#1 SMP Fri Dec 13 13:06:13 UTC 2013"], ["centos", "6.5", "Final", "Linux-2.6.32-431.1.2.0.1.el6.x86_64-x86_64-with-centos-6.5-Final", "2.6.32-431.1.2.0.1.el6.x86_644", "#1 SMP Fri Dec 13 13:06:13 UTC 2013"]])
    os = {}
    os["arch"] = "x86_64"
    os["dist"] = [OS[0], OS[1], OS[2]]
    os["machine"] = "x86_64" 
    os["platform"] = OS[3]
    os["release"] = OS[4]
    os["system"] = "Linux" 
    os["version"] = OS[5]
    return os 

def genPlatform(vendor):
    if "HP" in vendor:
        return random.choice(["DL360", "DL360p"])
    elif "Dell" in vendor:
        return random.choice(["R710", "R610", "R410", "C6100", "C1100", "C2100", "R720", "R620", "R910"])
    elif "Supermicro" in vendor:
        return random.choice(["SD423X", "A342J"])
    elif "Cisco" in vendor:
        return random.choice(["C24", "C22", "C220", "C240"])
    elif "Quanta" in vendor:
        return random.choice(["Roadrunner", "Windmill"])

def genAttributes(vendor):
    #genrate a Attributes dictionary
    attributes = {}
    attributes["UUID"] = genUUID()
    attributes["assetTag"] = "".join([random.choice(string.ascii_letters + string.digits) for n in xrange(12)]).upper()
    attributes["cSerial"] = "".join([random.choice(string.ascii_letters + string.digits) for n in xrange(7)]).upper()
    attributes["cVendor"] = vendor
    attributes["fqdn"] = "nodeprime-" + str(random.randint(0,10000000)) + ",nodeprime.net"
    attributes["ips"] = genIPs()
    attributes["isPXE"] = random.randint(0,1)
    attributes["isRAID"] = random.randint(0,1)
    attributes["memTotal"] = random.randrange(8,48,8)
    attributes["platform"] = genPlatform(vendor)
    attributes["serial"] = "".join([random.choice(string.ascii_letters + string.digits) for n in xrange(7)]).upper() 
    attributes["type"] = "Rack Mount Chassis"
    attributes["vendor"] = vendor
    return attributes

def genNIC(id):
     #Genreate a NICS dictionary
    nic = {}
    nic["firmware"] = "bc 5.2.2 NCSI 2.0.6"
    nic["interface"] = "eth" + str(id)
    nic["link"] = "yes"
    nic["mac"] = genMAC()
    nic["pciID"] = "0000:0" + str(id) + ":00.0"
    nic["platform"] ="Broadcom Corporation NetXtreme II BCM5709 Gigabit Ethernet (rev 20)"
    nic["type"] = "Twisted Pair" 
    return nic 

def genNICS():
    #Genreate a NICS dictionary
    return [genNIC(x) for x in range(random.randrange(2,10,2))]

def genPCI(vendor):
    #Genreate a PCI dictionary
    pci = [dict() for x in range(26)]
    pci[0]["pciID"] = "00:00.0"
    pci[0]["type"] = "Host bridge"
    pci[0]["platform"] = "Intel Corporation 5520 I/O Hub to ESI Port (rev 13)"
    pci[1]["pciID"] = "00:01.0"
    pci[1]["type"] = "PCI bridge"
    pci[1]["platform"] = "Intel Corporation 5520/5500/X58 I/O Hub PCI Express Root Port 1 (rev 13)"
    pci[2]["pciID"] = "00:03.0"
    pci[2]["type"] = "PCI bridge"
    pci[2]["platform"] = "Intel Corporation 5520/5500/X58 I/O Hub PCI Express Root Port 3 (rev 13)"
    pci[3]["pciID"] = "00:04.0"
    pci[3]["type"] = "PCI bridge"
    pci[3]["platform"] = "Intel Corporation 5520/X58 I/O Hub PCI Express Root Port 4 (rev 13)"
    pci[4]["pciID"] = "00:05.0"
    pci[4]["type"] = "PCI bridge"
    pci[4]["platform"] = "Intel Corporation 5520/X58 I/O Hub PCI Express Root Port 5 (rev 13)"
    pci[5]["pciID"] = "00:06.0"
    pci[5]["type"] = "PCI bridge"
    pci[5]["platform"] = "Intel Corporation 5520/X58 I/O Hub PCI Express Root Port 6 (rev 13)"
    pci[6]["pciID"] = "00:07.0"
    pci[6]["type"] = "PCI bridge"
    pci[6]["platform"] = "Intel Corporation 5520/5500/X58 I/O Hub PCI Express Root Port 7 (rev 13)"
    pci[7]["pciID"] = "00:09.0"
    pci[7]["type"] = "PCI bridge"
    pci[7]["platform"] = "Intel Corporation 5520/5500/X58 I/O Hub PCI Express Root Port 9 (rev 13)"
    pci[8]["pciID"] = "00:14.0"
    pci[8]["type"] = "PIC"
    pci[8]["platform"] = "Intel Corporation 5520/5500/X58 I/O Hub System Management Registers (rev 13)"
    pci[9]["pciID"] = "00:14.1"
    pci[9]["type"] = "PIC"
    pci[9]["platform"] = "Intel Corporation 5520/5500/X58 I/O Hub GPIO and Scratch Pad Registers (rev 13)"
    pci[10]["pciID"] = "00:14.2"
    pci[10]["type"] = "PIC"
    pci[10]["platform"] = "Intel Corporation 5520/5500/X58 I/O Hub Control Status and RAS Registers (rev 13)"
    pci[11]["pciID"] = "00:1a.0"
    pci[11]["type"] = "USB controller"
    pci[11]["platform"] = "Intel Corporation 82801I (ICH9 Family) USB UHCI Controller #4 (rev 02)"
    pci[12]["pciID"] = "00:1a.1"
    pci[12]["type"] = "USB controller"
    pci[12]["platform"] = "Intel Corporation 82801I (ICH9 Family) USB UHCI Controller #5 (rev 02)"
    pci[13]["pciID"] = "00:1a.7"
    pci[13]["type"] = "USB controller"
    pci[13]["platform"] = "Intel Corporation 82801I (ICH9 Family) USB2 EHCI Controller #2 (rev 02)"
    pci[14]["pciID"] = "00:1d.0"
    pci[14]["type"] = "USB controller"
    pci[14]["platform"] = "Intel Corporation 82801I (ICH9 Family) USB UHCI Controller #1 (rev 02)"
    pci[15]["pciID"] = "00:1d.1"
    pci[15]["type"] = "USB controller"
    pci[15]["platform"] = "Intel Corporation 82801I (ICH9 Family) USB UHCI Controller #2 (rev 02)"
    pci[16]["pciID"] = "00:1d.7"
    pci[16]["type"] = "USB controller"
    pci[16]["platform"] = "Intel Corporation 82801I (ICH9 Family) USB2 EHCI Controller #1 (rev 02)"
    pci[17]["pciID"] = "00:1e.0"
    pci[17]["type"] = "PCI bridge"
    pci[17]["platform"] = "Intel Corporation 82801 PCI Bridge (rev 92)"
    pci[18]["pciID"] = "00:1f.0"
    pci[18]["type"] = "ISA bridge"
    pci[18]["platform"] = "Intel Corporation 82801IB (ICH9) LPC Interface Controller (rev 02)"
    pci[19]["pciID"] = "00:1f.2"
    pci[19]["type"] = "IDE interface"
    pci[19]["platform"] = "Intel Corporation 82801IB (ICH9) 2 port SATA Controller [IDE mode] (rev 02)"
    pci[20]["pciID"] = "01:00.0"
    pci[20]["type"] = "Ethernet controller"
    pci[20]["platform"] = "Broadcom Corporation NetXtreme II BCM5709 Gigabit Ethernet (rev 20)"
    pci[21]["pciID"] = "01:00.1"
    pci[21]["type"] = "Ethernet controller"
    pci[21]["platform"] = "Broadcom Corporation NetXtreme II BCM5709 Gigabit Ethernet (rev 20)"
    pci[22]["pciID"] = "02:00.0"
    pci[22]["type"] = "Ethernet controller"
    pci[22]["platform"] = "Broadcom Corporation NetXtreme II BCM5709 Gigabit Ethernet (rev 20)"
    pci[23]["pciID"] = "02:00.1"
    pci[23]["type"] = "Ethernet controller"
    pci[23]["platform"] = "Broadcom Corporation NetXtreme II BCM5709 Gigabit Ethernet (rev 20)"
    pci[24]["pciID"] = "03:00.0"
    pci[24]["type"] = "RAID bus controller"
    pci[24]["platform"] = "LSI Logic / Symbios Logic MegaRAID SAS 1078 (rev 04)"
    pci[25]["pciID"] = "08:03.0"
    pci[25]["type"] = "VGA compatible controller"
    pci[25]["platform"] = "Matrox Electronics Systems Ltd. MGA G200eW WPCM450 (rev 0a)"
    return pci

def genProcessors():
    #Genreate a Processors dictionary
    proc = random.choice([["Intel(R) Xeon(R) CPU E5506 @ 2.13GHz", 2.1299999999999999, 4], ["Intel(R) Xeon(R) CPU E5649 @ 2.53GHz", 2.5399999999999999, 6], ["Intel(R) Xeon(R) CPU E5687 @ 3.60GHz",3.6099999999999999,4], ["Intel(R) Xeon(R) CPU E5638 @ 2.00GHz",2.0099999999999999,6], ["Intel(R) Xeon(R) CPU E5680 @ 3.33GHz",3.3399999999999999,6]])
    processors = [dict() for x in range(2)]
    processors[0]["family"] = "Xeon"
    processors[0]["platform"] = proc[0]
    processors[0]["socket"] = "Proc 1" 
    processors[0]["speed"] = proc[1]
    processors[0]["status"] = "Populated:Enabled"
    processors[0]["threads"] = proc[2] * 2
    processors[0]["units"] = "GHz"
    processors[0]["vendor"] = "Intel"
    processors[1]["family"] = "Xeon"
    processors[1]["platform"] = proc[0]
    processors[1]["socket"] = "Proc 2" 
    processors[1]["speed"] = proc[1]
    processors[1]["status"] = "Populated:Enabled" 
    processors[1]["threads"] = proc[2] * 2
    processors[1]["units"] = "GHz", 
    processors[1]["vendor"] = "Intel"
    
    return processors

def genPDisk(index):
    #Generate Physical Disk
    pdisk = {}
    pdisk["firmware"] = str(random.randint(0,12)) + "." + str(random.randint(0,45))
    pdisk["interface"] = "SAS"
    pdisk["mErrors"] = random.choice([0, 0, 0, 0, 0, 0, random.randint(0,45)])
    pdisk["platform"] = "SAS Hard Drive" 
    pdisk["sErrors"] = "N/A"
    pdisk["size"] = random.randrange(1024,4096,1024)
    pdisk["slot"] = index
    pdisk["type"] = "Data Drive"
    pdisk["units"] = "GB"
    pdisk["vendor"] = random.choice(["Western Digital", "Segate", "Hitachi", "Samsung"])
    return pdisk

def genPDisks(vendor):
    #Genreate a Pyhsical disks dictionary
    return [genPDisk(x) for x in range(random.randint(1,12))]

def genStorageController(vendor, pDisks):
    #Genreate a Sorage Controller dictionary
    storageController = {}
    storageController["firmware"] = str(random.randint(0,12)) + "." + str(random.randint(0,45))
    storageController["totalDisks"]= pDisks
    storageController["failedDisks"]= 0
    storageController["pciID"]= "03:00.0"
    storageController["cache"]= "256MB"
    storageController["enclosureSlots"]= 12
    storageController["criticalDisks"]= 0
    storageController["enclosureDeviceID"]= 32
    storageController["model"]= "LSI Logic MegaRAID SAS 1078 RAID Controller"
    storageController["oemModel"]= "LSI Logic / Symbios Logic MegaRAID SAS 1078 (rev 04)"
    storageController["bbu"] = "Present"
    return storageController

def genVDisks(vendor):
    #Genreate a vDisks dictionary
    '''{
                "disks": 1, 
                "name": "A00084825001438013419760F639", 
                "raid": "5", 
                "size": 410.10000000000002, 
                "state": "OK", 
                "units": "GB"
            }'''
    return {}

def genUSB(vendor):
    #Genreate a USB dictionary
    usb = [dict() for x in range(8)]
    usb[0]["usbID"] = "Bus 001 Device 001: ID 1d6b:000"
    usb[0]["platform"] = "Linux Foundation 2.0 root hub"
    usb[1]["usbID"] = "Bus 002 Device 001: ID 1d6b:000"
    usb[1]["platform"] = "Linux Foundation 2.0 root hub"
    usb[2]["usbID"] = "Bus 003 Device 001: ID 1d6b:000"
    usb[2]["platform"] = "Linux Foundation 1.1 root hub"
    usb[3]["usbID"] = "Bus 004 Device 001: ID 1d6b:000"
    usb[3]["platform"] = "Linux Foundation 1.1 root hub"
    usb[4]["usbID"] = "Bus 005 Device 001: ID 1d6b:000"
    usb[4]["platform"] = "Linux Foundation 1.1 root hub"
    usb[5]["usbID"] = "Bus 006 Device 001: ID 1d6b:000"
    usb[5]["platform"] = "Linux Foundation 1.1 root hub"
    usb[6]["usbID"] = "Bus 001 Device 003: ID 0424:251"
    usb[6]["platform"] = "Standard Microsystems Corp. USB 2.0 Hub"
    usb[7]["usbID"] = "Bus 005 Device 002: ID 0624:024"
    usb[7]["platform"] = "Avocent Corp."
    return usb

def genNodeInfo():
    vendor = random.choice(["Dell", "HP", "Cisco", "Quanta", "Supermicro"])
    nodeInfo = {}
    nodeInfo["type"] = "server"
    nodeInfo["date"] = genTime()
    nodeInfo["attributes"] = genAttributes(vendor)
    nodeInfo["components"] = {}
    nodeInfo["components"]["OS"] = genOS()
    nodeInfo["components"]["bios"] = genBIOS(vendor)
    nodeInfo["components"]["bmc"] = genBMC(vendor)
    nodeInfo["components"]["memory"] = genMemory(nodeInfo["attributes"]["memTotal"])
    nodeInfo["components"]["nics"] = genNICS()
    nodeInfo["components"]["pDisks"] = genPDisks(vendor)
    nodeInfo["components"]["vDisks"] = genVDisks(vendor)
    nodeInfo["components"]["packages"] = genPackages()
    nodeInfo["components"]["pci"] = genPCI(vendor)
    nodeInfo["components"]["processors"] = genProcessors()
    nodeInfo["components"]["storageController"] = genStorageController(vendor, len(nodeInfo["components"]["pDisks"]))
    nodeInfo["components"]["usb"] = genUSB(vendor)
    return nodeInfo

if len(sys.argv) == 1:
    print "usage: " + sys.argv[0] + " numberOfNodesToMock"
    sys.exit(errno.EINVAL)

for n in xrange(int(sys.argv[1])):
    ni = genNodeInfo()
    out = open("../mockData/servers/" + ni["attributes"]["UUID"] + ".json", "w")
    out.write(str(json.JSONEncoder().encode(ni)))
    out.close()
