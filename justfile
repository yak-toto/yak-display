alias c := check
alias bi := build_image

check:
    pre-commit run -a

build_image:
    {{ justfile_directory() }}/scripts/build_image.sh
