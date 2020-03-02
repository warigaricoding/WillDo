export abstract class Base64 {

	private static readonly alphabet= "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
	private static readonly alphabetBuffer= Uint8Array.from(Base64.alphabet, x => x.charCodeAt(0) ); 
	private static readonly radixLength= 6;
	private static readonly radixFlag= ( 1 << Base64.radixLength ) - 1;
	private static readonly bufferSize= Math.ceil( 32 / Base64.radixLength );

	public static fromInteger(n): string
	{
		let x= n & Base64.radixFlag;
		let array= new Uint8Array( Base64.bufferSize );
		let i= Base64.bufferSize;
		do {
			array[ --i ]= Base64.alphabetBuffer[ x ];
			n>>>= Base64.radixLength;
		} while (  x=  n & Base64.radixFlag  );

		return String.fromCharCode.apply(this, array.subarray(i));
	}
}
