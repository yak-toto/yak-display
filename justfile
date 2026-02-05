alias r := run
alias c := check
alias bi := build_image

run:
    npm run dev

check:
    pre-commit run -a

build_image:
    {{ justfile_directory() }}/scripts/build_image.sh
