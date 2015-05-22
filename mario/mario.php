#!/usr/bin/php
<?php
	do {
		echo "Height: ";
		$height = fgets(STDIN);
	} while (($height < 0) || ($height > 23));
	
	if ($height == 0) {
		return;
	}
	$spaces = $height - 1;
	$hashes = 2;
	
	for ($lines=0; $lines < $height; $lines++) { 
		for ($ii=0; $ii < $spaces; $ii++) { 
			echo " ";
		}
		
		for ($ii=0; $ii < $hashes; $ii++) { 
			echo "#";
		}
		
		echo "\n";
		$spaces--;
		$hashes++;
	}
?>