
// provides support for api property decorators

/** represents a property that shouldn't be sent to the server nor received */
export function ApiIgnore( target: object, propertyKey: string | symbol ): void
{
	apiHelper.getMetadata(target.constructor)[ propertyKey ]= null;	
}

/** represents a property that has differences with that of the server */
export function ApiProperty(apiName: string, apiType?: string)
{
	return function ( target: object, propertyKey: string | symbol )
		{
			apiHelper.getMetadata(target.constructor)[ propertyKey ]= [ apiName, apiType ];
		}
}


	// look away I say
		// these are not the droids you're looking for
			// if you're in here you've gone too far down the rabbit hole


const ApiPropertiesKey= Symbol("__apiPropertiesMetadata__");

export class ApiHelper<T>
{
	private init: boolean;
	private properties: _.Mapping[];
	private transformations: _.Transformation<T>[];

	constructor(private constructor: new () => T)
	{
		this.init= false;
	}

	public toApiObject(obj: T): any
	{
		if ( ! this.init && ! this.initialize() )
			return obj;

		const apiObj= {};
			
		if ( this.properties )
			for ( const prop of  this.properties )
				apiObj[ prop.apiName ]= obj[ prop.name ];

		if ( this.transformations )
			for ( const transformation of this.transformations )
				apiObj[ transformation.apiName ]= transformation.toApiProperty(obj[ transformation.name ]);

		// delete apiObj["id"];

		return apiObj;
	}

	public fromApiObject(apiObj: any): T
	{
		if ( ! this.init && ! this.initialize() )
			if ( apiObj instanceof this.constructor )
				return apiObj as T;
			else return Object.assign(new this.constructor(), apiObj);
		else if ( ! apiObj )
			return apiObj;

		const obj: T = new this.constructor();
			
		if ( this.properties )
			for ( const prop of this.properties )
					obj[ prop.name ]= prop.fromApiProperty(apiObj[ prop.apiName ]);

		if ( this.transformations )
			for ( const transformation of this.transformations )
					obj[ transformation.name ]=  transformation.fromApiProperty(apiObj[ transformation.apiName ]);

		return obj;
	}

	private initialize(): boolean
	{
		let classMetadata;
		if ( ! this.constructor || !( classMetadata=  this.constructor[ApiPropertiesKey] ) )
			return false;
		this.properties= [];
		this.transformations= [];
		
		const prototype= new this.constructor(); // the class should instantiate all its primitive types
		for ( const prop in prototype )
		{
			const propMetadata= classMetadata[ prop ] as [ string, string ];

			if ( propMetadata !== null )
				if ( propMetadata && propMetadata[1] )
					( this.transformations || ( this.transformations= [] ) )
						.push( new _.Transformation(prop, propMetadata[0], propMetadata[1], typeof prototype[ prop ]) );
				else ( this.properties || ( this.properties= [] ) )
						.push( new _.Mapping(prop, propMetadata? propMetadata[0] : prop, typeof prototype[ prop ]) );
		}
		
		return this.init= true;	
	}
}

// tslint:disable-next-line: no-namespace
namespace apiHelper
{

	export class Mapping
	{
		name: string | symbol;
		apiName: string;
		fromApiProperty: ( apiVal: any ) => any;
		constructor(name: string, apiName: string, fromType: string)
		{
			this.name= name;
			this.apiName= apiName;
			this.fromApiProperty= Converter[ "to" + fromType.substring(0, 1).toUpperCase() + fromType.substring(1).toLowerCase() ];
	    }
	}

	export class Transformation<T> extends Mapping
	{
		toApiProperty: ( val: T ) => any;
		constructor(name: string, apiName: string, apiType: string, fromType: string)
		{
			apiType= apiType.substring(0, 1).toUpperCase() + apiType.substring(1).toLowerCase();
			if ( apiType === "Datestring" )
				fromType= "datestring";
			super(name, apiName, fromType);
			this.toApiProperty= Converter[ "to" + apiType ];
	    }
	}

	export function getMetadata(constructor: any): object
	{
		if ( ! constructor )
			constructor= this.constructor= {};

		let propMetadata= constructor[ ApiPropertiesKey ];
		if ( ! propMetadata )
			propMetadata= constructor[ ApiPropertiesKey ]= {};

		return propMetadata;
	}

	class Converter
	{
		static toBoolean(obj: any): boolean
		{
			return !! obj;
		}

		static toInteger(obj: any): number
		{
			return obj | 0;
		}

		static toFloat(obj: any): number
		{
			return +obj || 0;
		}

		static toNumber(obj: any): number
		{
			return +obj || 0;
		}

		static toString(obj: any): string
		{
			return String( obj || "" );
		}

		static toDatestring(obj: any): string
		{
			return new Date ( obj || 0 ).toISOString();
		}

		static toObject(obj: any): object
		{
			return Object(obj);
		}

		static toUndefined(obj: any): any // unknown type!
		{
			return obj;
		}

	}
}
import _= apiHelper;
