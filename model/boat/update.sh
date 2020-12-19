pushd collada
unzip *.zip
popd

../../../COLLADA2GLTF/build/COLLADA2GLTF-bin -i collada/*.dae -o gltf/boat.gltf -v 2.0 -s
