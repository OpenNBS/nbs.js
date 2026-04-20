{
  description = "Nix development environment using Bun runtime and Biome formatter";

  # Unstable for Bun 1.3.11, use stable once updated
  inputs.nixpkgs.url = "github:NixOS/nixpkgs";

  outputs =
    { self, ... }@inputs:

    let
      supportedSystems = [
        "x86_64-linux"
        "aarch64-linux"
        "aarch64-darwin"
      ];
      forEachSupportedSystem =
        f:
        inputs.nixpkgs.lib.genAttrs supportedSystems (
          system:
          f {
            inherit system;
            pkgs = import inputs.nixpkgs { inherit system; };
          }
        );
    in
    {
      devShells = forEachSupportedSystem (
        { pkgs, system }:
        {
          default = pkgs.mkShellNoCC {
            packages = with pkgs; [
              bun

              biome
              rumdl
            ];
          };
        }
      );
    };
}
