<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class Create{{class_name}}Table extends Migration
{
	/**
	 * Run the migrations.
	 */
	public function up()
	{
		Schema::create('{{table_name}}', function (Blueprint $table) {
{{fields}}
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down()
	{
		Schema::drop('{{table_name}}');
	}
}
