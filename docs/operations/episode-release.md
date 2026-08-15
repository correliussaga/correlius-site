# Episode Release Workflow

This runbook describes the repository portion of adding or removing a public Correlius episode. It does not authorize a release; every film, caption, image, credit, and claim still requires human approval.

## Add Episode N+1

1. Retain the completed source master and checksum in approved private, backed-up storage. Never add a master to either website repository.
2. Upload the master through the Cloudflare Stream dashboard and wait for processing to finish.
3. Configure only approved Correlius playback origins. Do not enable signed URLs for an anonymous public release and do not describe origin restriction as DRM.
4. Upload the reviewed synchronized English caption track, select the intended default behavior, and verify it against the processed Stream asset.
5. Create an episode file from `src/content/episodes/_template.yaml` with `status: draft`.
6. Add reviewed public metadata and web-optimized thumbnail, poster, and social-image derivatives under `public/images/episodes/`. Keep originals and source artwork outside the web repository.
7. Complete rights, credits, and content review. Keep the record in `draft` while any required value remains incomplete.
8. Run the locked test suite. Review the protected preview on supported mobile and desktop browsers, including captions, controls, failure content, metadata, ordering, and existing episodes.
9. Set the record to `released` only after the Stream UID, runtime, release date, ready English caption track, images, metadata, and all three approval flags are complete. A genuine reviewed future entry may use `coming-soon`; no player will render.
10. Merge only after required checks and owner self-review pass. Verify the canonical page, Watch order, sitemap/discovery status, allowed origins, captions, and Stream usage visibility after deployment.

Adding a record must not require a change to top-level navigation, route templates, authentication, or partner configuration.

## Unpublish an episode

1. For an ordinary correction, change the record to `unpublished`, merge the reviewed change, and verify the page and Watch card are absent.
2. For urgent legal or safety removal, follow the private response plan and disable or restrict the Stream asset first when immediate playback removal is necessary.
3. Review alternate deployment/provider URLs so rollback cannot unintentionally republish the removed episode.
4. Preserve the master and response evidence privately. Do not improvise permanent deletion or public legal statements from this runbook.
