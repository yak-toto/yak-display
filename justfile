alias bi := build_image

build_image:
    {{ justfile_directory() }}/scripts/build_image.sh
