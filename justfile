alias r := run
alias b := build
alias c := check
alias bi := build_image

run:
    npm run dev

build:
    npm run build

check:
    pre-commit run -a

build_image:
    {{ justfile_directory() }}/scripts/build_image.sh
