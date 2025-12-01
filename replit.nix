{pkgs}: {
  deps = [
    pkgs.haskellPackages.debian-binary
    pkgs.debian-goodies
    pkgs.haskellPackages.debian
    pkgs.asterisk
    pkgs.perlPackages.meta
    pkgs.sbclPackages.meta
    pkgs.rPackages.hydrostats
    pkgs.home-assistant-component-tests.twilio
    pkgs.rPackages.twilio
  ];
}
