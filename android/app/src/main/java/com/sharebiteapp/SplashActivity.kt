package com.sharebiteapp

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity

class SplashActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Start MainActivity after showing splash screen
        val intent = Intent(this, MainActivity::class.java)
        startActivity(intent)
        finish()
    }
}
