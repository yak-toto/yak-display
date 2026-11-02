alias r := run
alias b := build
alias c := check
alias bi := build_image

run:
    bun run dev

build:
    bun run build

check:
    prek run -a

build_image:
    {{ justfile_directory() }}/scripts/build_image.sh
