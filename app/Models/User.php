<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\UserRole;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'nip_nim',
        'role',
        'unit',
        'password',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var list<string>
     */
    protected $appends = [
        'id_user',
        'nama',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
        ];
    }

    public function getIdUserAttribute(): int
    {
        return $this->id;
    }

    public function getNamaAttribute(): string
    {
        return $this->name;
    }

    /**
     * Dokumen pengajuan submitted by this user.
     *
     * @return HasMany<DokumenPengajuan, $this>
     */
    public function dokumenPengajuans(): HasMany
    {
        return $this->hasMany(DokumenPengajuan::class, 'user_id');
    }

    /**
     * Status trackings recorded by this user.
     *
     * @return HasMany<StatusTracking, $this>
     */
    public function statusTrackings(): HasMany
    {
        return $this->hasMany(StatusTracking::class, 'user_id');
    }

    public function isPengusul(): bool
    {
        return $this->role === UserRole::Pengusul;
    }

    public function isStafKeuangan(): bool
    {
        return $this->role === UserRole::StafKeuangan;
    }

    public function isPimpinan(): bool
    {
        return $this->role === UserRole::Pimpinan;
    }

    public function isAdmin(): bool
    {
        return $this->role === UserRole::Admin;
    }
}
